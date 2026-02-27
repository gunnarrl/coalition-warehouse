// Modified from app.js in activity 2
const express = require('express');
const path = require('path');
const db = require('./db-connector');
const app = express();
const PORT = 30905;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/customers', async function (req, res) {
    try {

        const query = "SELECT * FROM Customers;"
        const [rows] = await db.query(query); // Store the results

        // Send the results to the browser
        res.send(JSON.stringify(rows));

    } catch (error) {
        console.error("Error executing query:", error);

        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database query.");
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});