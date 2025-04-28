const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors()); // allow frontend to talk to backend
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form data

// connect to MySQL database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// simple test route
app.get('/', (req, res) => {
  res.send('✅ Backend server is running!');
});

// login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const query = 'SELECT role FROM users WHERE username = ? AND password = ?';
  
  db.execute(query, [username, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error.');
    }
    
    if (results.length > 0) {
      res.json({ success: true, role: results[0].role });
    } else {
      res.json({ success: false, message: 'Invalid credentials.' });
    }
  });
});

// start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
