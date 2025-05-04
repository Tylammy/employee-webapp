import React, { useEffect, useState } from 'react';

function EmployeeInfo() {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('username');

    fetch(`http://localhost:5000/api/employee/email/${email}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError('Failed to load employee info.');
        } else {
          setEmployee(data);
        }
      })
      .catch(() => setError('Failed to load employee info.'));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!employee) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Information</h1>
      <p><strong>Name:</strong> {employee.Fname} {employee.Lname}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Division:</strong> {employee.division_name}</p>
      <p><strong>Job Title:</strong> {employee.job_title}</p>
      <p><strong>Hire Date:</strong> {employee.HireDate?.substring(0, 10)}</p>
      <p><strong>Salary:</strong> ${parseFloat(employee.Salary).toFixed(2)}</p>
      <p><strong>SSN (last 4):</strong> {employee.last4SSN}</p>
    </div>
  );
}

export default EmployeeInfo;

