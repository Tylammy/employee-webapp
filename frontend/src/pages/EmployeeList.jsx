import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/employees') // ✅ Fixed endpoint
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
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

  if (loading) return <div className="p-6">Loading employee data...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!employees.length) return <div className="p-6">No employees found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Employee Details</h1>
      <table className="table-auto w-full border border-collapse">
        <thead className="bg-gray-100">
        <AdminNavbar />
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
          {employees.map(emp => {
            const salary = parseFloat(emp.Salary); // ✅ Convert string to float safely
            return (
              <tr key={emp.empid}>
                <td className="border px-4 py-2">{emp.empid}</td>
                <td className="border px-4 py-2">{emp.Fname} {emp.Lname}</td>
                <td className="border px-4 py-2">{emp.email}</td>
                <td className="border px-4 py-2">{emp.HireDate?.substring(0, 10)}</td>
                <td className="border px-4 py-2">
                  {isNaN(salary) ? 'N/A' : `$${salary.toFixed(2)}`}
                </td>
                <td className="border px-4 py-2">{emp.job_title || 'N/A'}</td>
                <td className="border px-4 py-2">{emp.division_name || 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
