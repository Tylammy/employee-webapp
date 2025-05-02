# Employee Management System

This project is a full-featured employee management system designed for Company Z. It provides both a Java console interface and a web-based interface (Node.js + HTML) connected to a shared MySQL database.

The application supports:
- Admin login with full CRUD access
- Employee login with read-only access to personal data
- Search, update, salary adjustment, and payroll report features
- Web interface (for extra credit) using Node.js, Express, and HTML

## Authors

Java console version by: Gauri Saraf (gsaraf1@student.gsu.edu) and Tahia Islam (tislam8@student.gsu.edu)
Web version (Node.js + HTML) by: Christy Lam (clam12@student.gsu.edu) and Ethan Nuwagaba (enuwagaba1@student.gsu.edu)

## Project Structure

employee-webapp/
- backend/              Node.js + Express API (for web version)
- frontend/             HTML, CSS, and JavaScript (for web version)
- java-console/         Terminal interface (Main.java)
- database-scripts/     SQL scripts to set up MySQL schema + test data
- README.md

## Console Version (Java)

- Built in Main.java using JDBC and the Scanner class
- Run in terminal using:
  cd java-console
  javac Main.java
  java Main
- Supports:
  - Admin login (CRUD, payroll reports, search)
  - Employee login (view-only access)
- Uses .env for database credentials (requires dotenv-java)

## Web Version (Node.js + HTML) - Extra Credit

- Fully working web interface with login, dashboards, and data views
- Frontend: plain HTML/CSS/JavaScript
- Backend: Node.js + Express (backend/server.js)
- Connects to the same MySQL database as the Java version

To run the web version:

1. Install dependencies:
   cd backend
   npm install

2. Start the server:
   npm start

3. Open the site in your browser:
   http://localhost:3001

## Database Setup

1. Open MySQL (via DBeaver or CLI)
2. Run the following SQL scripts in order from the database-scripts folder:
   - employee_databas_MySQL_create.sql
   - employeeData_INSERT_datum.sql
   - employeeData_foreignKeys.sql

## Test Users

Role: Admin
Username: admin1
Password: adminpass

Role: Employee
Username: emp1
Password: emppass

## Features Implemented

Admin:
- Full login and dashboard access
- Search employees by name, DOB, ID, or SSN
- Update employee information (salary, job title, division)
- Apply salary adjustments to specific ranges
- Generate reports:
  - Payroll history by employee
  - Total pay by job title or division

Employee:
- Secure login
- View own information (name, salary, job title, division)
- View own 12-month payroll history

## Extra Credit Justification

- A working web-based UI using Node.js and Express
- Login and dashboard functionality mirrors the Java version
- Utilizes HTTP requests, dynamic rendering, and full database integration

## Tech Stack

Frontend: HTML, CSS, JavaScript
Backend: Java Console (JDBC), Node.js + Express
Database: MySQL
Tools: DBeaver, dotenv, Git

## Future Improvements

- Add session or token-based authentication
- Style the frontend with Bootstrap or Tailwind
- Use React for a more dynamic UI
- Add exportable reports (PDF or CSV)

## Authors

Java console version by: [Your Team]
Web version (Node.js + HTML) by: [Your Name]

## Notes

This project satisfies all class requirements and includes an optional full-stack web version to enhance user experience and meet extra credit criteria.
