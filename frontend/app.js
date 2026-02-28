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

// Catch-all route to serve the React app
app.get('/{*path}', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});