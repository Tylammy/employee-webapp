import React, { useEffect, useState } from 'react';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employee data when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch employees:', err);
        setError('Could not load employee list');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading employee data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Employees</h1>
      <table className="table-auto w-full border border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Hire Date</th>
            <th className="border px-4 py-2">Salary</th>
            <th className="border px-4 py-2">Job Title</th>
            <th className="border px-4 py-2">Division</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.empid}>
              <td className="border px-4 py-2">{emp.empid}</td>
              <td className="border px-4 py-2">{emp.Fname} {emp.Lname}</td>
              <td className="border px-4 py-2">{emp.email}</td>
              <td className="border px-4 py-2">{emp.HireDate}</td>
              <td className="border px-4 py-2">${emp.Salary.toFixed(2)}</td>
              <td className="border px-4 py-2">{emp.job_title || 'N/A'}</td>
              <td className="border px-4 py-2">{emp.division_name || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;