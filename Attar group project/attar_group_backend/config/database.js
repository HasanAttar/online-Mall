require('dotenv').config();
const mysql = require('mysql2/promise');

let pool;

// Function to initialize the connection pool
const initializeDatabase = () => {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        console.log('Database connection pool created successfully.');
    } catch (error) {
        console.error('Error creating database connection pool:', error.message);
        process.exit(1); // Exit the application if the database fails to initialize
    }
};

// Initialize the database connection pool
initializeDatabase();

// Export the pool for raw queries
module.exports = pool;
