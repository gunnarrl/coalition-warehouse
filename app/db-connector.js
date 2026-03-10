// Citation for the following file:
// Date: 2/27/2026
// Adapted from: CS 340 Activity 2
// Source URL: https://canvas.oregonstate.edu/courses/2031764/assignments/10323319?module_item_id=26243357

// Get an instance of mysql we can use in the app
import mysql from 'mysql2'

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_larsengu',
    password: '8146',
    database: 'cs340_larsengu'
}).promise(); // This makes it so we can use async / await rather than callbacks

// Export it for use in our application
export default pool;