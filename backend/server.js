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

    if (results.length === 1) {
      res.json({ success: true, role: results[0].role });
    } else if (results.length > 1) {
      console.warn('Multiple users matched — possible data issue.');
      res.status(500).json({ success: false, message: 'Duplicate users found. Contact admin.' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }    
  });
});

// Route: Get all employees (admin view)
app.get('/api/employees', (req, res) => {
  const query = `
    SELECT e.empid, e.Fname, e.Lname, e.email, e.HireDate, e.Salary,
          e.SSN, jt.job_title, d.Name AS division_name
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

// Route: Search for employees (admin view)
app.get('/api/employees/search', (req, res) => {
  const { fname, lname, empid, dob } = req.query;

  const filters = [];
  const params = [];

  if (fname) {
    filters.push("LOWER(e.Fname) LIKE ?");
    params.push(`%${fname.toLowerCase()}%`);
  }
  if (lname) {
    filters.push("LOWER(e.Lname) LIKE ?");
    params.push(`%${lname.toLowerCase()}%`);
  }
  if (empid) {
    filters.push("e.empid = ?");
    params.push(empid);
  }
  if (dob) {
    filters.push("a.DOB = ?");
    params.push(dob);
  }

  if (filters.length === 0) {
    return res.status(400).json({ error: "At least one field is required" });
  }

  const sql = `
    SELECT e.empid, e.Fname, e.Lname, e.email, e.Salary, e.SSN,
           jt.job_title, d.Name AS division_name, a.DOB
    FROM employees e
    LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid
    LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id
    LEFT JOIN employee_division ed ON e.empid = ed.empid
    LEFT JOIN division d ON ed.div_ID = d.ID
    LEFT JOIN address a ON e.empid = a.empid
    WHERE ${filters.join(" AND ")}
  `;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("\u274C Error in search route:", err);
      return res.status(500).json({ error: "Search failed" });
    }
    res.json(results);
  });
});

// Route: Update employee info (admin view)
app.put('/api/employees/update/:empid', (req, res) => {
  const empid = req.params.empid;
  const { salary, job_title_id, division_id } = req.body;

  const updateSalary = `
    UPDATE employees SET Salary = ? WHERE empid = ?;
  `;
  const updateJob = `
    INSERT INTO employee_job_titles (empid, job_title_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE job_title_id = VALUES(job_title_id);
  `;
  const updateDivision = `
    INSERT INTO employee_division (empid, div_ID)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE div_ID = VALUES(div_ID);
  `;

  db.query(updateSalary, [salary, empid], (err1) => {
    if (err1) return res.status(500).json({ error: 'Salary update failed' });

    db.query(updateJob, [empid, job_title_id], (err2) => {
      if (err2) return res.status(500).json({ error: 'Job title update failed' });

      db.query(updateDivision, [empid, division_id], (err3) => {
        if (err3) return res.status(500).json({ error: 'Division update failed' });

        res.json({ success: true, message: 'Employee updated successfully' });
      });
    });
  });
});

// Get all job titles
app.get('/api/job-titles', (req, res) => {
  const sql = 'SELECT job_title_id, job_title FROM job_titles';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch job titles' });
    res.json(results);
  });
});

// Get all divisions
app.get('/api/divisions', (req, res) => {
  const sql = 'SELECT ID, Name FROM division';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch divisions' });
    res.json(results);
  });
});

// Route: Adjust salary (admin view)
app.put('/api/employees/adjust-salary', (req, res) => {
  const { percent, minSalary, maxSalary } = req.body;
  const multiplier = 1 + (percent / 100);

  const sql = `
    UPDATE employees 
    SET Salary = Salary * ?
    WHERE Salary >= ? AND Salary <= ?;
  `;

  db.query(sql, [multiplier, minSalary, maxSalary], (err, result) => {
    if (err) {
      console.error('❌ Salary adjustment error:', err);
      return res.status(500).json({ error: 'Salary adjustment failed' });
    }

    res.json({ success: true, affectedRows: result.affectedRows });
  });
});

app.get('/api/employees/eligible-salary-adjustment', (req, res) => {
  const { min, max } = req.query;

  const sql = `
    SELECT empid, Fname, Lname, email, Salary
    FROM employees
    WHERE Salary >= ? AND Salary <= ?
    ORDER BY Salary DESC
  `;

  db.query(sql, [min, max], (err, results) => {
    if (err) {
      console.error('❌ Error fetching eligible employees:', err);
      return res.status(500).json({ error: 'Failed to preview employees' });
    }
    res.json(results);
  });
});

// Route: Get employee payroll (admin view)
app.get('/api/payroll/:empid', (req, res) => {
  const empid = req.params.empid;

  const sql = `
    SELECT pay_date, earnings, fed_tax, fed_med, fed_SS, state_tax, retire_401k, health_care
    FROM payroll
    WHERE empid = ?
    ORDER BY pay_date DESC
  `;

  db.query(sql, [empid], (err, results) => {
    if (err) {
      console.error('❌ Payroll fetch error:', err);
      return res.status(500).json({ error: 'Could not retrieve payroll history' });
    }

    const formatted = results.map(row => {
      const totalDeductions =
        row.fed_tax + row.fed_med + row.fed_SS + row.state_tax + row.retire_401k + row.health_care;
      const net = row.earnings - totalDeductions;

      return {
        ...row,
        net_pay: net
      };
    });

    res.json(formatted);
  });
});

// Route: Delete employee (admin view)
app.delete('/api/employees/:empid', (req, res) => {
  const empid = req.params.empid;

  // Delete from child tables first (due to foreign key constraints)
  const deleteJob = 'DELETE FROM employee_job_titles WHERE empid = ?';
  const deleteDiv = 'DELETE FROM employee_division WHERE empid = ?';
  const deletePay = 'DELETE FROM payroll WHERE empid = ?';
  const deleteAddr = 'DELETE FROM address WHERE empid = ?';
  const deleteEmp = 'DELETE FROM employees WHERE empid = ?';

  db.query(deleteJob, [empid], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete job title' });

    db.query(deleteDiv, [empid], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to delete division' });

      db.query(deletePay, [empid], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete payroll' });

        db.query(deleteAddr, [empid], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to delete address' });

          db.query(deleteEmp, [empid], (err, result) => {
            if (err) return res.status(500).json({ error: 'Failed to delete employee' });
            if (result.affectedRows === 0) {
              return res.status(404).json({ error: 'Employee not found' });
            }
            res.json({ success: true });
          });
        });
      });
    });
  });
});

app.get('/api/employee/:username', (req, res) => {
  const username = req.params.username;

  const sql = `
    SELECT e.empid, e.Fname, e.Lname, e.email, e.HireDate, e.Salary,
           jt.job_title, d.Name AS division_name, RIGHT(e.SSN, 4) AS last4SSN
    FROM users u
    JOIN employees e ON u.username = e.email OR u.username = e.empid
    LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid
    LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id
    LEFT JOIN employee_division ed ON e.empid = ed.empid
    LEFT JOIN division d ON ed.div_ID = d.ID
    WHERE u.username = ?
    LIMIT 1;
  `;

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error('❌ Error fetching employee info:', err);
      return res.status(500).json({ error: 'Failed to fetch employee info' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(results[0]);
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
