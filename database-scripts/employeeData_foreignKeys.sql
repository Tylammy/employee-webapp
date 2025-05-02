USE employeeData;

SET FOREIGN_KEY_CHECKS = 0;

-- 🔗 address.empid → employees.empid
ALTER TABLE address
ADD FOREIGN KEY (empid) 
REFERENCES employees(empid);

-- 🔗 address.city_id → city.city_id
ALTER TABLE address
ADD FOREIGN KEY (city_id) 
REFERENCES city(city_id);

-- 🔗 address.state_id → state.state_id
ALTER TABLE address
ADD FOREIGN KEY (state_id) 
REFERENCES state(state_id);

-- 🔗 payroll.empid → employees.empid
ALTER TABLE payroll
ADD FOREIGN KEY (empid) 
REFERENCES employees(empid);

-- 🔗 employee_job_titles.empid → employees.empid
ALTER TABLE employee_job_titles
ADD FOREIGN KEY (empid) 
REFERENCES employees(empid);

-- 🔗 employee_job_titles.job_title_id → job_titles.job_title_id
ALTER TABLE employee_job_titles
ADD FOREIGN KEY (job_title_id) 
REFERENCES job_titles(job_title_id);

-- 🔗 employee_division.empid → employees.empid
ALTER TABLE employee_division
ADD FOREIGN KEY (empid) 
REFERENCES employees(empid);

-- 🔗 employee_division.div_ID → division.ID
ALTER TABLE employee_division
ADD FOREIGN KEY (div_ID) 
REFERENCES division(ID);

SET FOREIGN_KEY_CHECKS = 1;