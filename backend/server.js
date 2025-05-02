// Import required libraries
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();
const port = process.env.PORT || 5000;

// CORS setup
const corsOptions = {
  origin: 'http://localhost:3000', // React dev server
  credentials: true, // if you're using cookies or auth headers
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,        // e.g. localhost
  user: process.env.DB_USER,        // e.g. root
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE // e.g. employeeData
});

// Test backend route
app.get('/', (req, res) => {
  res.send('✅ Backend server is running!');
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT role FROM users WHERE username = ? AND password = ?';
  db.execute(query, [username, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }

    if (results.length > 0) {
      res.json({ success: true, role: results[0].role });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
