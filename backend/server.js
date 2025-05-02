const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Updated CORS setup to match frontend (3001)
const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.get('/', (req, res) => {
  res.send('✅ Backend server is running!');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username);

  const query = 'SELECT role FROM users WHERE username = ? AND password = ?';
  db.execute(query, [username, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }

    console.log('Query results:', results);

    if (results.length > 0) {
      res.json({ success: true, role: results[0].role });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});


// Route: Get all employees (admin view)
app.get('/api/employees', (req, res) => {
  const query = `
    SELECT e.empid, e.Fname, e.Lname, e.email, e.HireDate, e.Salary,
           jt.job_title, d.Name AS division_name
    FROM employees e
    LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid
    LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id
    LEFT JOIN employee_division ed ON e.empid = ed.empid
    LEFT JOIN division d ON ed.div_ID = d.ID
    ORDER BY e.empid;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ error: 'Failed to retrieve employees' });
    }
    res.json(results);
  });
});
