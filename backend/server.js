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
  res.send('Backend server is running!');
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
  const { fname, lname, empid, dob, ssn } = req.query;

  const filters = [];
  const params = [];

  if (fname) {
    filters.push("LOWER(e.Fname) LIKE ?");
    params.push(`%${fname.trim().toLowerCase()}%`);
  }
  if (lname) {
    filters.push("LOWER(e.Lname) LIKE ?");
    params.push(`%${lname.trim().toLowerCase()}%`);
  }
  if (empid) {
    filters.push("e.empid = ?");
    params.push(empid.trim());
  }
  if (dob) {
    filters.push("a.DOB = ?");
    params.push(dob.trim());
  }
  if (ssn) {
    filters.push("e.SSN = ?");
    params.push(ssn.trim());
  }

  if (filters.length === 0) {
    return res.status(400).json({ error: 'At least one search field required' });
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
    WHERE ${filters.join(' AND ')}`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error in search route:', err);
      return res.status(500).json({ error: 'Search failed' });
    }
    res.json(results);
  });
});


// Route: Get employee by flexible criteria (for update search)
app.get('/api/employee/flex-search', (req, res) => {
  const { ssn, fname, lname, dob } = req.query;
  const filters = [];
  const values = [];

  if (ssn) {
    filters.push('e.SSN = ?');
    values.push(ssn);
  }
  if (fname) {
    filters.push('LOWER(e.Fname) LIKE ?');
    values.push(`%${fname.toLowerCase()}%`);
  }
  if (lname) {
    filters.push('LOWER(e.Lname) LIKE ?');
    values.push(`%${lname.toLowerCase()}%`);
  }
  if (dob) {
    filters.push('a.DOB = ?');
    values.push(dob);
  }

  if (filters.length === 0) return res.status(400).json({ error: 'No search criteria provided' });

  const sql = `
    SELECT e.empid, e.Fname, e.Lname, e.email, e.HireDate, e.Salary, e.SSN,
           jt.job_title_id, jt.job_title, d.ID as division_id, d.Name as division_name, a.DOB
    FROM employees e
    LEFT JOIN address a ON e.empid = a.empid
    LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid
    LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id
    LEFT JOIN employee_division ed ON e.empid = ed.empid
    LEFT JOIN division d ON ed.div_ID = d.ID
    WHERE ${filters.join(' AND ')}
    LIMIT 1
  `;

  db.query(sql, values, (err, results) => {
    if (err) return res.status(500).json({ error: 'Search failed' });
    if (results.length === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json(results[0]);
  });
});

// Route: Update employee info (only modified fields)
app.put('/api/employees/update/:empid', (req, res) => {
  const empid = req.params.empid;
  const { salary, job_title_id, division_id } = req.body;

  const tasks = [];

  if (salary !== undefined && salary !== '') {
    tasks.push(cb => db.query('UPDATE employees SET Salary = ? WHERE empid = ?', [salary, empid], cb));
  }
  if (job_title_id !== undefined && job_title_id !== '') {
    tasks.push(cb => db.query(`
      INSERT INTO employee_job_titles (empid, job_title_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE job_title_id = VALUES(job_title_id)
    `, [empid, job_title_id], cb));
  }

  if (division_id !== undefined && division_id !== '') {
    tasks.push(cb => db.query(`
      INSERT INTO employee_division (empid, div_ID)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE div_ID = VALUES(div_ID)
    `, [empid, division_id], cb));
  }

  if (tasks.length === 0) return res.status(400).json({ error: 'No update fields provided' });

  let completed = 0;
  let failed = false;

  tasks.forEach(task => {
    task(err => {
      if (err && !failed) {
        failed = true;
        return res.status(500).json({ error: 'Update failed' });
      }
      completed++;
      if (completed === tasks.length && !failed) {
        res.json({ success: true, message: 'Employee updated successfully' });
      }
    });
  });
});

// Get all job titles
app.get('/api/job-titles', (req, res) => {
  db.query('SELECT job_title_id, job_title FROM job_titles', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch job titles' });
    res.json(results);
  });
});

// Get all divisions
app.get('/api/divisions', (req, res) => {
  db.query('SELECT ID, Name FROM division', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch divisions' });
    res.json(results);
  });
});

// Adjust Salary in Range (Admin Only)
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

// a) Pay history by employee (admin: all, employee: self)
app.get('/api/payroll-history', (req, res) => {
  const { role, username, empid } = req.query;

  const baseQuery = `
    SELECT e.empid, e.Fname, e.Lname, jt.job_title, p.pay_date, p.earnings, 
           p.fed_tax, p.fed_med, p.fed_SS, p.state_tax, p.retire_401k, 
           p.health_care, 
           (p.earnings - (p.fed_tax + p.fed_med + p.fed_SS + p.state_tax + p.retire_401k + p.health_care)) AS net_pay
    FROM payroll p
    JOIN employees e ON p.empid = e.empid
    LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid
    LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id
  `;

  const filter = role === 'employee'
    ? `WHERE e.email = ?`
    : empid ? `WHERE e.empid = ?` : '';

  const query = `${baseQuery} ${filter} ORDER BY e.empid, p.pay_date`;

  const param = role === 'employee' ? [username] : empid ? [empid] : [];

  db.query(query, param, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch payroll history' });
    res.json(results);
  });
});

// b) Total pay by job title for a month
app.get('/api/payroll-jobtitle', (req, res) => {
  const { month } = req.query;
  const query = `
    SELECT jt.job_title, SUM(p.earnings) AS total_pay
    FROM payroll p
    JOIN employee_job_titles ejt ON p.empid = ejt.empid
    JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id
    WHERE MONTH(p.pay_date) = ?
    GROUP BY jt.job_title
  `;
  db.query(query, [month], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch pay by job title' });
    res.json(results);
  });
});

// c) Total pay by division for a month
app.get('/api/payroll-division', (req, res) => {
  const { month } = req.query;
  const query = `
    SELECT d.Name AS division, SUM(p.earnings) AS total_pay
    FROM payroll p
    JOIN employee_division ed ON p.empid = ed.empid
    JOIN division d ON ed.div_ID = d.ID
    WHERE MONTH(p.pay_date) = ?
    GROUP BY d.Name
  `;
  db.query(query, [month], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch pay by division' });
    res.json(results);
  });
});

// Route: Get employee by ID
app.get('/api/employee/:id', (req, res) => {
  const empid = req.params.id;

  const sql = `
    SELECT e.empid, e.Fname, e.Lname, e.email, e.HireDate, e.Salary, e.SSN,
           jt.job_title_id, jt.job_title, d.ID as division_id, d.Name as division_name, a.DOB
    FROM employees e
    LEFT JOIN address a ON e.empid = a.empid
    LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid
    LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id
    LEFT JOIN employee_division ed ON e.empid = ed.empid
    LEFT JOIN division d ON ed.div_ID = d.ID
    WHERE e.empid = ?
    LIMIT 1
  `;

  db.query(sql, [empid], (err, results) => {
    if (err) {
      console.error('Error fetching employee by ID:', err);
      return res.status(500).json({ error: 'Failed to fetch employee' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(results[0]);
  });
});

app.delete('/api/employees/:id', (req, res) => {
  const empid = req.params.id;
  db.query('DELETE FROM employees WHERE empid = ?', [empid], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete employee' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
