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

// used to parse JSON request bodies
app.use(express.json());

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

// CUSTOMER CRUD ROUTES
app.get('/customers', async function (req, res) {
    try {
        const query = "SELECT * FROM Customers;"
        const [rows] = await db.query(query);
        res.send(JSON.stringify(rows));

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("An error occurred while running the SELECT operation.");
    }
});

app.delete('/customers/:customerID', async function (req, res) {
    try {
        const deleteProc = 'CALL DeleteCustomer(?);';
        // Pass customerID as a parameter to the SP
        await db.query(deleteProc, req.params.customerID);
        res.status(200).send(`Customer ${req.params.customerID} deleted.`);
    } catch (error) {
        console.error("Error executing Delete:", error);
        res.status(500).send("An error occurred while executing the delete PL/SQL.");
    }
});

app.put("/customers/:customerID", async function (req, res) {
    try {
        const updateProc = 'CALL UpdateCustomer(?, ?, ?, ?, ?);';
        // Pass parameters as an array
        await db.query(updateProc, [req.params.customerID, req.body.customerfName, req.body.customerlName, req.body.customerEmail, req.body.customerAddr]);
        res.status(200).send(`Customer ${req.params.customerID} updated.`);
    } catch (error) {
        console.error("Error executing Update:", error);
        res.status(500).send("An error occurred while executing the update PL/SQL.");
    }
});

app.post("/customers", async function (req, res) {
    try {
        const addProc = 'CALL AddCustomer(?, ?, ?, ?);';
        // Pass parameters as an array
        await db.query(addProc, [req.body.customerfName, req.body.customerlName, req.body.customerEmail, req.body.customerAddr]);
        res.status(201).send(`Customer ${req.body.customerfName} ${req.body.customerlName} added.`);
    } catch (error) {
        console.error("Error executing Add:", error);
        res.status(500).send("An error occurred while executing the add PL/SQL.");
    }
});

// PRODUCT CRUD ROUTES
app.delete('/products/:productID', async function (req, res) {
    try {
        const deleteProc = 'CALL DeleteProduct(?);';
        // Pass productID as a parameter to the SP
        await db.query(deleteProc, req.params.productID);
        res.status(200).send(`Product ${req.params.productID} deleted.`);
    } catch (error) {
        console.error("Error executing Delete:", error);
        res.status(500).send("An error occurred while executing the delete PL/SQL.");
    }
});

app.put("/products/:productID", async function (req, res) {
    try {
        const updateProc = 'CALL UpdateProduct(?, ?, ?);';
        // Pass parameters as an array
        await db.query(updateProc, [req.params.productID, req.body.productName, req.body.listCost]);
        res.status(200).send(`Product ${req.params.productID} updated.`);
    } catch (error) {
        console.error("Error executing Update:", error);
        res.status(500).send("An error occurred while executing the update PL/SQL.");
    }
});

app.post("/products", async function (req, res) {
    try {
        const addProc = 'CALL AddProduct(?, ?);';
        // Pass parameters as an array
        await db.query(addProc, [req.body.productName, req.body.listCost]);
        res.status(201).send(`Product ${req.body.productName} added.`);
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

// SALES ORDER ROUTES
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

app.put("/salesOrders/:saleOrderID", async function (req, res) {
    try {
        const updateProc = 'CALL UpdateSalesOrder(?, ?, ?, ?);';
        // Pass parameters as an array
        await db.query(updateProc, [req.params.saleOrderID, req.body.customerID, req.body.warehouseID, req.body.saleDate]);
        res.status(200).send(`Sales Order ${req.params.saleOrderID} updated.`);
    } catch (error) {
        console.error("Error executing Update:", error);
        res.status(500).send("An error occurred while executing the update PL/SQL.");
    }
});

app.delete("/salesOrders/:saleOrderID", async function (req, res) {
    try {
        const deleteProc = 'CALL DeleteSalesOrder(?);';
        // Pass saleOrderID as a parameter to the SP
        await db.query(deleteProc, req.params.saleOrderID);
        res.status(200).send(`Sales Order ${req.params.saleOrderID} deleted.`); // send 200 status so the message shows up (204 didn't show message for some reason)
    } catch (error) {
        console.error("Error executing Delete:", error);
        res.status(500).send("An error occurred while executing the delete PL/SQL.");
    }
});

app.post("/salesOrders", async function (req, res) {
    try {
        const addProc = 'CALL AddSalesOrder(?, ?, ?);';
        // Pass parameters as an array
        await db.query(addProc, [req.body.customerID, req.body.warehouseID, req.body.saleDate]);
        res.status(201).send(`Sales Order ${req.body.customerID} ${req.body.warehouseID} ${req.body.saleDate} added.`);
    } catch (error) {
        console.error("Error executing Add:", error);
        res.status(500).send("An error occurred while executing the add PL/SQL.");
    }
});

// SALES ORDER ITEMS ROUTES
app.get("/salesOrderItems", async function (req, res) {
    try {
        const query = `
SELECT SalesOrderItems.saleOrderItemID, SalesOrderItems.saleOrderID, SalesOrderItems.productID, SalesOrderItems.quantity, 
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

app.put("/salesOrderItems/:saleOrderItemID", async function (req, res) {
    try {
        const updateProc = 'CALL UpdateSalesOrderItem(?, ?, ?, ?);';
        // Pass parameters as an array
        await db.query(updateProc, [req.params.saleOrderItemID, req.body.productID, req.body.quantity, req.body.salePrice]);
        res.status(200).send(`Sales Order Item ${req.params.saleOrderItemID} updated.`);
    } catch (error) {
        console.error("Error executing Update:", error);
        res.status(500).send("An error occurred while executing the update PL/SQL.");
    }
});

app.delete("/salesOrderItems/:saleOrderItemID", async function (req, res) {
    try {
        const deleteProc = 'CALL DeleteSalesOrderItem(?);';
        // Pass saleOrderItemID as a parameter to the SP
        await db.query(deleteProc, req.params.saleOrderItemID);
        res.status(200).send(`Sales Order Item ${req.params.saleOrderItemID} deleted.`); // send 200 status so the message shows up (204 didn't show message for some reason)
    } catch (error) {
        console.error("Error executing Delete:", error);
        res.status(500).send("An error occurred while executing the delete PL/SQL.");
    }
});

app.post("/salesOrderItems", async function (req, res) {
    try {
        const addProc = 'CALL AddSalesOrderItem(?, ?, ?, ?);';
        // Pass parameters as an array
        await db.query(addProc, [req.body.saleOrderID, req.body.productID, req.body.quantity, req.body.salePrice]);
        res.status(201).send(`Sales Order Item ${req.body.saleOrderID} ${req.body.productID} added.`);
    } catch (error) {
        console.error("Error executing Add:", error);
        res.status(500).send("An error occurred while executing the add PL/SQL.");
    }
});

// PURCHASES ROUTES (basically the same as sales orders, but with purchases variables)
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

app.put("/purchaseOrders/:purchaseOrderID", async function (req, res) {
    try {
        const updateProc = 'CALL UpdatePurchaseOrder(?, ?, ?, ?);';
        // Pass parameters as an array
        await db.query(updateProc, [req.params.purchaseOrderID, req.body.supplierID, req.body.warehouseID, req.body.purchaseDate]);
        res.status(200).send(`Purchase Order ${req.params.purchaseOrderID} updated.`);
    } catch (error) {
        console.error("Error executing Update:", error);
        res.status(500).send("An error occurred while executing the update PL/SQL.");
    }
});

app.delete("/purchaseOrders/:purchaseOrderID", async function (req, res) {
    try {
        const deleteProc = 'CALL DeletePurchaseOrder(?);';
        // Pass parameters as an array
        await db.query(deleteProc, req.params.purchaseOrderID);
        res.status(200).send(`Purchase Order ${req.params.purchaseOrderID} deleted.`);
    } catch (error) {
        console.error("Error executing Delete:", error);
        res.status(500).send("An error occurred while executing the delete PL/SQL.");
    }
});

app.post("/purchaseOrders", async function (req, res) {
    try {
        const addProc = 'CALL AddPurchaseOrder(?, ?, ?);';
        // Pass parameters as an array
        await db.query(addProc, [req.body.supplierID, req.body.warehouseID, req.body.purchaseDate]);
        res.status(201).send(`Purchase Order ${req.body.supplierID} ${req.body.warehouseID} ${req.body.purchaseDate} added.`);
    } catch (error) {
        console.error("Error executing Add:", error);
        res.status(500).send("An error occurred while executing the add PL/SQL.");
    }
});

// PURCHASES ORDER ITEMS ROUTES (basically the same as sales order items, but with purchases variables)
app.get("/purchaseOrderItems", async function (req, res) {
    try {
        const query = `
SELECT PurchaseOrderItems.purchaseOrderItemID, PurchaseOrderItems.purchaseOrderID, PurchaseOrderItems.productID, PurchaseOrderItems.quantity, 
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

app.put("/purchaseOrderItems/:purchaseOrderItemID", async function (req, res) {
    try {
        const updateProc = 'CALL UpdatePurchaseOrderItem(?, ?, ?, ?);';
        // Pass parameters as an array
        await db.query(updateProc, [req.params.purchaseOrderItemID, req.body.productID, req.body.quantity, req.body.purchasePrice]);
        res.status(200).send(`Purchase Order Item ${req.params.purchaseOrderItemID} updated.`);
    } catch (error) {
        console.error("Error executing Update:", error);
        res.status(500).send("An error occurred while executing the update PL/SQL.");
    }
});

app.delete("/purchaseOrderItems/:purchaseOrderItemID", async function (req, res) {
    try {
        const deleteProc = 'CALL DeletePurchaseOrderItem(?);';
        // Pass parameters as an array
        await db.query(deleteProc, req.params.purchaseOrderItemID);
        res.status(200).send(`Purchase Order Item ${req.params.purchaseOrderItemID} deleted.`);
    } catch (error) {
        console.error("Error executing Delete:", error);
        res.status(500).send("An error occurred while executing the delete PL/SQL.");
    }
});

app.post("/purchaseOrderItems", async function (req, res) {
    try {
        const addProc = 'CALL AddPurchaseOrderItem(?, ?, ?, ?);';
        // Pass parameters as an array
        await db.query(addProc, [req.body.purchaseOrderID, req.body.productID, req.body.quantity, req.body.purchasePrice]);
        res.status(201).send(`Purchase Order Item ${req.body.purchaseOrderID} ${req.body.productID} ${req.body.quantity} ${req.body.purchasePrice} added.`);
    } catch (error) {
        console.error("Error executing Add:", error);
        res.status(500).send("An error occurred while executing the add PL/SQL.");
    }
});

// Catch-all route to serve the React app
app.get('/{*path}', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});
