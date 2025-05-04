import React, { useEffect, useState } from 'react';
import EmployeeNavbar from '../components/EmployeeNavbar';

function EmployeeInfo() {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username'); // assuming you stored this on login
  console.log('Fetching employee info for:', username);

  useEffect(() => {
    fetch(`http://localhost:5000/api/employee/email/${encodeURIComponent(username)}`)
    .then((res) => res.json())
    .then((data) => {
      console.log('Employee info response:', data); // 👈 log this
      if (data.error) {
        setError(data.error);
      } else {
        setEmployee(data);
      }
    })
      .catch((err) => {
        console.error(err);
        setError('❌ Failed to load employee info.');
      });
  }, [username]);

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!employee) return <p className="p-6">Loading employee info...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">My Info</h1>
      <ul className="space-y-2">
      <EmployeeNavbar />
        <li><strong>Name:</strong> {employee.Fname} {employee.Lname}</li>
        <li><strong>Email:</strong> {employee.email}</li>
        <li><strong>Hire Date:</strong> {employee.HireDate?.substring(0, 10)}</li>
        <li><strong>Salary:</strong> ${parseFloat(employee.Salary).toFixed(2)}</li>
        <li><strong>Job Title:</strong> {employee.job_title || 'N/A'}</li>
        <li><strong>Division:</strong> {employee.division_name || 'N/A'}</li>
        <li><strong>SSN (Last 4):</strong> ****-**-{employee.last4SSN}</li>
      </ul>
    </div>
  );
}

export default EmployeeInfo;
