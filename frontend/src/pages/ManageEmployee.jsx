import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';

function ManageEmployee() {
  const [mode, setMode] = useState('');
  const [search, setSearch] = useState({ empid: '', fname: '', lname: '', dob: '', ssn: '' });
  const [employee, setEmployee] = useState(null);
  const [jobTitles, setJobTitles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [form, setForm] = useState({ salary: '', job_title_id: '', division_id: '' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/job-titles').then(res => res.json()).then(setJobTitles);
    fetch('http://localhost:5000/api/divisions').then(res => res.json()).then(setDivisions);
  }, []);

  const handleSearch = async () => {
    const filled = Object.values(search).some(val => val.trim() !== '');
    if (!filled) {
      setMessage('Please fill in at least one search field.');
      return;
    }

    const params = new URLSearchParams();
    Object.entries(search).forEach(([key, val]) => {
      if (val.trim()) params.append(key, val.trim());
    });

    try {
      const res = await fetch(`http://localhost:5000/api/employee/flex-search?${params.toString()}`);
      const data = await res.json();
      if (data.empid) {
        setEmployee(data);
        setForm({
          salary: data.Salary,
          job_title_id: data.job_title_id || '',
          division_id: data.division_id || '',
        });
        setMessage('');
      } else {
        setEmployee(null);
        setMessage(data.error || 'Employee not found.');
      }
    } catch {
      setMessage('Server error during search.');
    }
  };

  const handleUpdate = async () => {
    const payload = {};
    if (form.salary !== '' && parseFloat(form.salary) !== parseFloat(employee.Salary)) payload.salary = form.salary;
    if (form.job_title_id && form.job_title_id !== employee.job_title_id?.toString()) payload.job_title_id = form.job_title_id;
    if (form.division_id && form.division_id !== employee.division_id?.toString()) payload.division_id = form.division_id;

    try {
      const res = await fetch(`http://localhost:5000/api/employees/update/${employee.empid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setMessage(data.success ? 'Employee updated successfully.' : (data.error || 'Update failed.'));
    } catch {
      setMessage('Server error during update.');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${employee.empid}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessage(`Employee ${employee.Fname} ${employee.Lname} (ID: ${employee.empid}) was successfully deleted.`);
        setEmployee(null);
        setSearch({ empid: '', fname: '', lname: '', dob: '', ssn: '' });
        setMode('');
        setConfirmDelete(false);
      } else {
        setMessage(`Failed to delete employee. ${data.error || ''}`);
      }
    } catch {
      setMessage('Server error while deleting employee.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Manage Employee</h1>

      {!mode && (
        <div className="space-y-4 mb-6">
          <button onClick={() => setMode('update')} className="bg-blue-600 text-white px-4 py-2 w-full">Update Employee</button>
          <button onClick={() => setMode('delete')} className="bg-red-600 text-white px-4 py-2 w-full">Delete Employee</button>
        </div>
      )}

      {mode && !employee && (
        <>
          <h2 className="text-lg font-semibold mb-2">Search for Employee</h2>
          {['empid', 'fname', 'lname', 'dob', 'ssn'].map(field => (
            <input
              key={field}
              className="border p-2 w-full mb-2"
              placeholder={`Enter ${field.toUpperCase()}`}
              value={search[field]}
              onChange={(e) => setSearch({ ...search, [field]: e.target.value })}
            />
          ))}
          <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 w-full mb-4">Search</button>
          {message && <p className="text-red-600 mb-2">{message}</p>}
        </>
      )}

      {employee && (
        <>
          <div className="bg-white p-4 rounded shadow border mb-4">
            <p><strong>ID:</strong> {employee.empid}</p>
            <p><strong>Name:</strong> {employee.Fname} {employee.Lname}</p>
            <p><strong>Current Job:</strong> {employee.job_title}</p>
            <p><strong>Division:</strong> {employee.division_name}</p>
            <p><strong>Salary:</strong> ${parseFloat(employee.Salary || 0).toFixed(2)}</p>
          </div>

          {mode === 'update' && (
            <div className="space-y-3">
              <input
                type="number"
                className="border p-2 w-full"
                value={form.salary}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />
              <select
                className="border p-2 w-full"
                value={form.job_title_id}
                onChange={(e) => setForm({ ...form, job_title_id: e.target.value })}
              >
                <option value="">Keep Current Job Title</option>
                {jobTitles.map(j => (
                  <option key={j.job_title_id} value={j.job_title_id}>{j.job_title}</option>
                ))}
              </select>
              <select
                className="border p-2 w-full"
                value={form.division_id}
                onChange={(e) => setForm({ ...form, division_id: e.target.value })}
              >
                <option value="">Keep Current Division</option>
                {divisions.map(d => (
                  <option key={d.ID} value={d.ID}>{d.Name}</option>
                ))}
              </select>
              <button className="bg-green-600 text-white px-4 py-2 w-full" onClick={handleUpdate}>Submit Update</button>
            </div>
          )}

          {mode === 'delete' && !confirmDelete && (
            <button
              className="mt-2 px-4 py-2 w-full text-white bg-red-600"
              onClick={() => setConfirmDelete(true)}
            >
              Confirm Delete Employee
            </button>
          )}

          {mode === 'delete' && confirmDelete && (
            <div className="mt-4">
              <p className="mb-2 font-medium">Are you sure you want to delete this employee?</p>
              <button className="bg-red-700 text-white px-4 py-2 w-full mb-2" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="bg-gray-400 text-white px-4 py-2 w-full" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
            </div>
          )}

          {message && <p className="mt-4 text-blue-700 font-semibold">{message}</p>}
        </>
      )}
    </div>
  );
}

export default ManageEmployee;