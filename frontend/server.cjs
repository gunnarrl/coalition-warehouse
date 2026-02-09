// Modified from app.js in activity 2
const express = require('express');
const path = require('path');
const app = express();
const PORT = 30905;

// Use static files for now
app.use(express.static(path.join(__dirname, 'dist')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});