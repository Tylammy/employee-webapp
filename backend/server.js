const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// test route
app.get('/', (req, res) => {
  res.send('Backend server running!');
});

// login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT role FROM users WHERE username = ? AND password = ?';
  db.execute(query, [username, password], (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length > 0) {
      res.json({ success: true, role: results[0].role });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
