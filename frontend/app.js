// Modified from app.js in activity 2
// Citation for use of AI Tools: VS Code's Gemini Code Assist to help debug issues with npm run production not persisting and the database data not being displayed
// Date: 02/27/2026
// Prompt: [Attached the app.js, customerPage.jsx, db-connector.js]
// "I have created a get endpoint that should return all customers from the database. However, when I run the app and go to the page, the table is empty and the following error
// is in the console [error (was returning html from before the endpoint was created)]. Please help me fix this issue."
// Results:
// We then iterated for a very long time trying to fix this issue, and found 2 bugs in the code. 
// 1. ESM syntax wasn't being used in app.js. 
// 2. The react app wasn't being served, only the /customers endpoint existed. Added express.static and a catch-all route to serve the react app. 
// AI Source URL: https://marketplace.visualstudio.com/items?itemName=Google.geminicodeassist

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db-connector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 30905;

// Serve the built React app from the dist/ directory
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/resetdb', async function (req, res) {
    try {
        const reset = "CALL sp_load_coalitiondb();";
        await db.query(reset);
        res.status(200).send("Database successfully reset.");
    } catch (error) {
        console.error("Error executing reset procedure:", error);
        res.status(500).send("An error occured while resetting database.");
    }
});

app.get('/customers', async function (req, res) {
    try {
        const query = "SELECT * FROM Customers;"
        const [rows] = await db.query(query);
        res.send(JSON.stringify(rows));

    } catch (error) {
        console.error("Error executing query:", error);

        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database query.");
    }
});

app.delete('/products/:productID', async function (req, res) {
    try {
        const productID = req.params.productID;
        const deleteProc = 'CALL DeleteProduct(?);';
        // Pass productID as a parameter to the SP
        await db.query(deleteProc, productID);
        res.status(204).send(`Product ${productID} deleted.`);
    } catch (error) {
        console.error("Error executing Delete:", error);
        res.status(500).send("An error occurred while executing the delete PL/SQL.");
    }
});

app.put("/products/:productID", async function (req, res) {
    try {
        const productID = req.params.productID;
        const productName = req.body.productName;
        const listCost = req.body.listCost;
        const updateProc = 'CALL UpdateProduct(?, ?, ?);';
        // Pass productID as a parameter to the SP
        await db.query(updateProc, productID, productName, listCost);
        res.status(204).send(`Product ${productID} updated.`);
    } catch (error) {
        console.error("Error executing Update:", error);
        res.status(500).send("An error occurred while executing the update PL/SQL.");
    }
});

app.post("/products", async function (req, res) {
    try {
        const productName = req.body.productName;
        const listCost = req.body.listCost;
        const addProc = 'CALL AddProduct(?, ?);';
        // Pass productID as a parameter to the SP
        await db.query(addProc, productName, listCost);
        res.status(201).send(`Product ${productName} added.`);
    } catch (error) {
        console.error("Error executing Add:", error);
        res.status(500).send("An error occurred while executing the add PL/SQL.");
    }
});



app.get("/products", async function (req, res) {
    try {
        const query = "SELECT * FROM Products;"
        const [rows] = await db.query(query);
        res.send(JSON.stringify(rows));
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred while executing the database query.");
    }
});

app.get("/warehouses", async function (req, res) {
    try {
        const query = "SELECT * FROM Warehouses;"
        const [rows] = await db.query(query);
        res.send(JSON.stringify(rows));
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred while executing the database query.");
    }
});

app.get("/vendors", async function (req, res) {
    try {
        const query = "SELECT * FROM Vendors;"
        const [rows] = await db.query(query);
        res.send(JSON.stringify(rows));
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred while executing the database query.");
    }
});

app.get("/inventory", async function (req, res) {
    try {
        const query = `
SELECT Warehouses.warehouseID, Products.productID, Inventory.inventoryID, Products.productName, Inventory.quantity, Products.listCost
FROM Inventory
JOIN Products ON Inventory.productID = Products.productID
JOIN Warehouses ON Inventory.warehouseID = Warehouses.warehouseID;`;
        const [rows] = await db.query(query);
        res.send(JSON.stringify(rows));
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred while executing the database query.");
    }
});

app.get("/catalog", async function (req, res) {
    try {
        const query = `
SELECT Vendors.vendorID, Vendors.vendorName, Products.productID, Products.productName, VendorProducts.costFromVendor
FROM VendorProducts
JOIN Vendors ON VendorProducts.vendorID = Vendors.vendorID
JOIN Products on VendorProducts.productID = Products.productID;`;
        const [rows] = await db.query(query);
        res.send(JSON.stringify(rows));
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred while executing the database query.");
    }
});

app.get("/salesOrders", async function (req, res) {
    try {
        const query = `
SELECT SalesOrders.saleOrderID, SalesOrders.saleDate,  Warehouses.warehouseID, Warehouses.warehouseName, Customers.customerID, Customers.customerLN, Customers.customerFN, Customers.customerAddr, Customers.customerEmail,
SUM(SalesOrderItems.quantity * SalesOrderItems.salePrice) AS costOfSale
FROM SalesOrders
JOIN Customers ON SalesOrders.customerID = Customers.customerID
JOIN Warehouses ON SalesOrders.warehouseID = Warehouses.warehouseID
LEFT JOIN SalesOrderItems ON SalesOrders.saleOrderID = SalesOrderItems.saleOrderID
GROUP BY SalesOrders.saleOrderID;`;
        const [rows] = await db.query(query);
        res.send(JSON.stringify(rows));
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred while executing the database query.");
    }
});

app.get("/salesOrderItems", async function (req, res) {
    try {
        const query = `
SELECT SalesOrderItems.saleOrderID, SalesOrderItems.productID, SalesOrderItems.quantity, 
SalesOrderItems.salePrice, Products.productName, SalesOrders.warehouseID
FROM SalesOrderItems
JOIN Products ON SalesOrderItems.productID = Products.productID
JOIN SalesOrders ON SalesOrderItems.saleOrderID = SalesOrders.saleOrderID;`;
        const [rows] = await db.query(query);
        res.send(JSON.stringify(rows));
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred while executing the database query.");
    }
});

app.get("/purchaseOrders", async function (req, res) {
    try {
        const query = `
SELECT PurchaseOrders.purchaseOrderID, PurchaseOrders.purchaseDate,  Warehouses.warehouseID, Warehouses.warehouseName, Vendors.vendorID, Vendors.vendorName,
SUM(PurchaseOrderItems.quantity * PurchaseOrderItems.purchasePrice) AS costOfPurchase
FROM PurchaseOrders
JOIN Warehouses ON PurchaseOrders.warehouseID = Warehouses.warehouseID
JOIN Vendors ON PurchaseOrders.vendorID = Vendors.vendorID
LEFT JOIN PurchaseOrderItems ON PurchaseOrders.purchaseOrderID = PurchaseOrderItems.purchaseOrderID
GROUP BY PurchaseOrders.purchaseOrderID;`;
        const [rows] = await db.query(query);
        res.send(JSON.stringify(rows));
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred while executing the database query.");
    }
});

app.get("/purchaseOrderItems", async function (req, res) {
    try {
        const query = `
SELECT PurchaseOrderItems.purchaseOrderID, PurchaseOrderItems.productID, PurchaseOrderItems.quantity, 
PurchaseOrderItems.purchasePrice, Products.productName, PurchaseOrders.warehouseID
FROM PurchaseOrderItems
JOIN Products ON PurchaseOrderItems.productID = Products.productID
JOIN PurchaseOrders ON PurchaseOrderItems.purchaseOrderID = PurchaseOrders.purchaseOrderID;`;
        const [rows] = await db.query(query);
        res.send(JSON.stringify(rows));
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred while executing the database query.");
    }
});

// Catch-all route to serve the React app
app.get('/{*path}', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});
