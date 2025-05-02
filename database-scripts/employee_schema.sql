/* 
    THESE ARE FOR dBeaver usage
    VS Code usage may give you unpredictable results. 	
*/

USE employeeData;


CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  role ENUM('admin', 'employee') NOT NULL
);

-- Insert two test users:
INSERT INTO users (username, password, role) VALUES 
  ('admin1', 'adminpass', 'admin'),
  ('emp1', 'emppass', 'employee');


/***********************************************************************/

CREATE TABLE IF NOT EXISTS employees (
  empid INT NOT NULL,
  Fname VARCHAR(65) NOT NULL,
  Lname VARCHAR(65) NOT NULL,
  email VARCHAR(65) NOT NULL,
  HireDate DATE,
  Salary DECIMAL(10,2) NOT NULL,
  SSN VARCHAR(12),
  PRIMARY KEY (empid)
);

/***********************************************************************/

CREATE TABLE payroll (
  payID INT,
  pay_date DATE,
  earnings DECIMAL(8,2),
  fed_tax DECIMAL(7,2),
  fed_med DECIMAL(7,2),
  fed_SS DECIMAL(7,2),
  state_tax DECIMAL(7,2),
  retire_401k DECIMAL(7,2),
  health_care DECIMAL(7,2),
  empid INT
);

/***********************************************************************/ 

DROP TABLE IF EXISTS employee_job_titles;

CREATE TABLE employee_job_titles (
  empid INT NOT NULL,
  job_title_id INT NOT NULL,
  PRIMARY KEY (empid, job_title_id)
);

/***********************************************************************/ 

CREATE TABLE job_titles (
  job_title_id INT,
  job_title VARCHAR(125) NOT null
  primary key (job_title_id)
);

/***********************************************************************/ 

CREATE TABLE employee_division (
  empid int NOT NULL,
  div_ID int NOT NULL,
  PRIMARY KEY (empid), foreign key (empid) references employees(empid), foreign key (div_id) references division(id)
);

/***********************************************************************/


CREATE TABLE division (
  ID int NOT NULL,
  Name varchar(100) DEFAULT NULL,
  city varchar(50) NOT NULL,
  addressLine1 varchar(50) NOT NULL,
  addressLine2 varchar(50) DEFAULT NULL,
  state varchar(50) DEFAULT NULL,
  country varchar(50) NOT NULL,
  postalCode varchar(15) NOT null,
  primary key (id)
); 

/***********************************************************************/ 
create table city (
	city_id int not null,
	name_of_city varchar(50),
	primary key (city_id)
);

/***********************************************************************/ 


create table state (
	state_id int not null,
	name_of_state varchar(50),
	primary key (state_id)
);

/***********************************************************************/ 


create table address (
	empid int not null,
	street varchar(100),
	city_id int not null,
	state_id int not null,
	zip varchar(15),
	gender varchar(15),
	race varchar(25),
	DOB DATE,
	phone_number varchar(15),
	primary key (empid)
);