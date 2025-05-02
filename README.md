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
- lib/                  Contains required .jar files for Java console version  
- README.md  

## Console Version (Java)

The Java console version is located in the `java-console/` folder and uses two external libraries stored in the `lib/` folder:
- `dotenv-java-X.X.X.jar` for reading environment variables
- `mysql-connector-java-X.X.X.jar` for connecting to MySQL

### Environment Setup

Create a `.env` file inside `java-console/` with the following content:

DB_URL=jdbc:mysql://localhost:3306/employeeData
DB_USER=root
DB_PASSWORD=your_mysql_password

### To Compile (from inside `java-console/`):

javac -cp "../lib/*" -encoding UTF-8 Main.java

### To Run (from inside `java-console/`):

java -cp ".;../lib/*" Main

Note: If you're on Mac or Linux, use `:` instead of `;` in the classpath.

## Web Version (Node.js + HTML) – Extra Credit

The web version is built using plain HTML/CSS/JS with a Node.js + Express backend. It connects to the same MySQL database as the Java console app.

### To Run the Web Version Locally:

1. Navigate to the backend folder:
   cd backend

2. Install required packages:
   npm install

3. Add a `.env` file in the `backend/` folder:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=employeeData

4. Start the server:
   npm start

5. Open the browser and go to:
   http://localhost:3001

## Database Setup

1. Open MySQL via DBeaver or terminal
2. Run the following scripts from `database-scripts/` in order:
   - `employee_databas_MySQL_create.sql`
   - `employeeData_INSERT_datum.sql`
   - `employeeData_foreignKeys.sql`

Ensure your MySQL server is running on `localhost` and listening on the default port (3306).

## Test Users

Admin  
Username: admin1  
Password: adminpass

Employee  
Username: emp1  
Password: emppass

## Features Implemented

### Admin
- Full login and dashboard access
- Search employees by name, DOB, ID, or SSN
- Update employee information (salary, job title, division)
- Apply salary adjustments to specific ranges
- Generate reports:
  - Payroll history by employee
  - Total pay by job title or division

### Employee
- Secure login
- View own information (name, salary, job title, division)
- View own 12-month payroll history

## Extra Credit Justification

- A working web-based UI using Node.js and Express
- Login and dashboard functionality mirrors the Java version
- Utilizes HTTP requests, dynamic rendering, and full database integration

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Java Console (JDBC), Node.js + Express
- Database: MySQL
- Tools: DBeaver, dotenv, Git

## Future Improvements

- Add session or token-based authentication
- Style the frontend with Bootstrap or Tailwind
- Use React for a more dynamic UI
- Add exportable reports (PDF or CSV)

## Notes

This project satisfies all class requirements and includes an optional full-stack web version to enhance user experience and meet extra credit criteria.
