USE employeeData;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS=0;

-- Clear all tables to ensure no duplicate data exists
TRUNCATE TABLE employees;
TRUNCATE TABLE job_titles;
TRUNCATE TABLE employee_job_titles;
TRUNCATE TABLE payroll;
TRUNCATE TABLE employee_division;
TRUNCATE TABLE division;
TRUNCATE TABLE address;

-- Remove DOB from employees table if it exists
ALTER TABLE employees DROP COLUMN IF EXISTS DOB;

-- Insert job titles
INSERT INTO job_titles (job_title_id, job_title)
VALUES 
(100, 'software manager'),
(101, 'software architect'),
(102, 'software engineer'),
(103, 'software developer'),
(200, 'marketing manager'),
(201, 'marketing associate'),
(202, 'marketing assistant'),
(900, 'Chief Exec. Officer'),
(901, 'Chief Finn. Officer'),
(902, 'Chief Info. Officer');

-- Insert employees
INSERT INTO employees (empid, Fname, Lname, email, HireDate, Salary, SSN)
VALUES 
(1, 'Snoopy', 'Beagle', 'Snoopy@example.com', '2022-08-01', 45000.00, '111-11-1111'),
(2, 'Charlie', 'Brown', 'Charlie@example.com', '2022-07-01', 48000.00, '111-22-1111'),
(3, 'Lucy', 'Doctor', 'Lucy@example.com', '2022-07-03', 55000.00, '111-33-1111'),
(4, 'Pepermint', 'Patti', 'Peppermint@example.com', '2022-08-02', 98000.00, '111-44-1111'),
(5, 'Linus', 'Blanket', 'Linus@example.com', '2022-09-01', 43000.00, '111-55-1111'),
(6, 'PigPin', 'Dusty', 'PigPin@example.com', '2022-10-01', 33000.00, '111-66-1111'),
(7, 'Scooby', 'Doo', 'Scooby@example.com', '1973-07-03', 78000.00, '111-77-1111'),
(8, 'Shaggy', 'Rodgers', 'Shaggy@example.com', '1973-07-11', 77000.00, '111-88-1111'),
(9, 'Velma', 'Dinkley', 'Velma@example.com', '1973-07-21', 82000.00, '111-99-1111'),
(10, 'Daphne', 'Blake', 'Daphne@example.com', '1973-07-30', 59000.00, '111-00-1111'),
(11, 'Bugs', 'Bunny', 'Bugs@example.com', '1934-07-01', 18000.00, '222-11-1111'),
(12, 'Daffy', 'Duck', 'Daffy@example.com', '1935-04-01', 16000.00, '333-11-1111'),
(13, 'Porky', 'Pig', 'Porky@example.com', '1935-08-12', 16550.00, '444-11-1111'),
(14, 'Elmer', 'Fudd', 'Elmer@example.com', '1934-08-01', 15500.00, '555-11-1111'),
(15, 'Marvin', 'Martian', 'Marvin@example.com', '1937-05-01', 28000.00, '777-11-1111');

-- Insert address information
INSERT INTO address (empid, street, city_id, state_id, zip, gender, race, DOB, phone_number)
VALUES
(1, '123 Doghouse Lane', 1, 1, '30301', 'Male', 'Beagle', '1990-05-15', '555-1111'),
(2, '456 Peanuts Street', 1, 1, '30302', 'Male', 'Human', '1985-08-22', '555-2222'),
(3, '789 Psychiatry Ave', 1, 1, '30303', 'Female', 'Human', '1988-03-10', '555-3333'),
(4, '321 Baseball Blvd', 1, 1, '30304', 'Female', 'Human', '1982-11-30', '555-4444'),
(5, '654 Blanket Way', 1, 1, '30305', 'Male', 'Human', '1995-07-04', '555-5555'),
(6, '987 Dusty Road', 1, 1, '30306', 'Male', 'Human', '1993-09-18', '555-6666'),
(7, '100 Mystery Lane', 2, 2, '10001', 'Male', 'Great Dane', '1975-02-14', '555-7777'),
(8, '200 Sandwich Street', 2, 2, '10002', 'Male', 'Human', '1978-06-25', '555-8888'),
(9, '300 Glasses Avenue', 2, 2, '10003', 'Female', 'Human', '1976-12-05', '555-9999'),
(10, '400 Fashion Blvd', 2, 2, '10004', 'Female', 'Human', '1980-04-20', '555-0000'),
(11, '500 Carrot Lane', 2, 2, '10005', 'Male', 'Rabbit', '1965-01-01', '555-1212'),
(12, '600 Pond Street', 2, 2, '10006', 'Male', 'Duck', '1968-07-12', '555-1313'),
(13, '700 Farm Road', 2, 2, '10007', 'Male', 'Pig', '1970-09-08', '555-1414'),
(14, '800 Hunting Trail', 2, 2, '10008', 'Male', 'Human', '1972-10-31', '555-1515'),
(15, '900 Mars Avenue', 2, 2, '10009', 'Male', 'Martian', '1963-04-22', '555-1616');

-- Assign job titles to employees
INSERT INTO employee_job_titles (empid, job_title_id)
VALUES
(1, 100), 
(2, 200), 
(3, 102), 
(4, 101), 
(5, 201), 
(6, 102),
(7, 100), 
(8, 202), 
(9, 202),
(10, 900), 
(11, 901), 
(12, 902),
(13, 103), 
(14, 103), 
(15, 202);

-- Insert divisions
INSERT INTO division (ID, Name, city, addressLine1, addressLine2, state, country, postalCode) 
VALUES
(1, 'Technology Engineering', 'Atlanta', '200 17th Street NW', '', 'GA', 'USA', '30363'),
(2, 'Marketing', 'Atlanta', '200 17th Street NW', '', 'GA', 'USA', '30363'),
(3, 'Human Resources', 'New York', '45 West 57th Street', '', 'NY', 'USA', '00034'),
(4, 'HQ', 'New York', '45 West 57th Street', '', 'NY', 'USA', '00034');

-- Assign employees to divisions
INSERT IGNORE INTO employee_division (empid, div_ID)
VALUES
(1, 4),
(2, 4),
(3, 4),
(4, 4),
(5, 1),
(6, 2),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 2),
(12, 2),
(13, 2),
(14, 3),
(15, 3);

-- Insert comprehensive payroll records (12 months for each employee)
INSERT INTO payroll (payID, pay_date, empid, earnings, fed_tax, fed_med, fed_SS, state_tax, retire_401k, health_care)
WITH months AS (
    SELECT 0 as month_offset UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
    UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 
    UNION SELECT 10 UNION SELECT 11
)
SELECT 
    e.empid * 100 + m.month_offset AS payID,
    DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL m.month_offset MONTH), '%Y-%m-01') AS pay_date,
    e.empid,
    ROUND(e.Salary/12, 2) AS earnings,
    ROUND((e.Salary/12)*0.32, 2) AS fed_tax,
    ROUND((e.Salary/12)*0.0145, 2) AS fed_med,
    ROUND((e.Salary/12)*0.062, 2) AS fed_SS,
    ROUND((e.Salary/12)*0.12, 2) AS state_tax,
    ROUND((e.Salary/12)*0.04, 2) AS retire_401k,
    ROUND((e.Salary/12)*0.031, 2) AS health_care
FROM employees e
CROSS JOIN months m
ORDER BY e.empid, m.month_offset;
-- View employee data with payroll information
SELECT 
    e.empid,
    e.Fname,
    e.Lname,
    e.Salary,
    COUNT(p.payID) AS pay_records,
    MIN(p.pay_date) AS first_pay_date,
    MAX(p.pay_date) AS last_pay_date
FROM employees e
LEFT JOIN payroll p ON e.empid = p.empid
GROUP BY e.empid, e.Fname, e.Lname, e.Salary
ORDER BY e.empid;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;