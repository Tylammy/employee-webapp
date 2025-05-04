import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [jobTitles, setJobTitles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/employees')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setEmployees(data);
        setFilteredEmployees(data);

        const uniqueTitles = [...new Set(data.map(emp => emp.job_title).filter(Boolean))];
        const uniqueDivisions = [...new Set(data.map(emp => emp.division_name).filter(Boolean))];
        setJobTitles(uniqueTitles);
        setDivisions(uniqueDivisions);

        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch employees:', err);
        setError('Could not load employee list');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...employees];
    if (selectedJobTitle) {
      filtered = filtered.filter(emp => emp.job_title === selectedJobTitle);
    }
    if (selectedDivision) {
      filtered = filtered.filter(emp => emp.division_name === selectedDivision);
    }
    setFilteredEmployees(filtered);
  }, [selectedJobTitle, selectedDivision, employees]);

  if (loading) return <div className="p-6">Loading employee data...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!employees.length) return <div className="p-6">No employees found.</div>;

  return (
    <div className="p-6">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">All Employee Details</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select
          className="border p-2"
          value={selectedJobTitle}
          onChange={(e) => setSelectedJobTitle(e.target.value)}
        >
          <option value="">All Job Titles</option>
          {jobTitles.map((title, idx) => (
            <option key={idx} value={title}>{title}</option>
          ))}
        </select>

        <select
          className="border p-2"
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
        >
          <option value="">All Divisions</option>
          {divisions.map((div, idx) => (
            <option key={idx} value={div}>{div}</option>
          ))}
        </select>
      </div>

      <table className="table-auto w-full border border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Hire Date</th>
            <th className="border px-4 py-2">Salary</th>
            <th className="border px-4 py-2">SSN</th>
            <th className="border px-4 py-2">Job Title</th>
            <th className="border px-4 py-2">Division</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => {
            const salary = parseFloat(emp.Salary);
            return (
              <tr key={emp.empid}>
                <td className="border px-4 py-2">{emp.empid}</td>
                <td className="border px-4 py-2">{emp.Fname} {emp.Lname}</td>
                <td className="border px-4 py-2">{emp.email}</td>
                <td className="border px-4 py-2">{emp.HireDate?.substring(0, 10)}</td>
                <td className="border px-4 py-2">
                  {isNaN(salary) ? 'N/A' : `$${salary.toFixed(2)}`}
                </td>
                <td className="border px-4 py-2">{emp.SSN ? `***-**-${emp.SSN.slice(-4)}` : 'N/A'}</td>
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