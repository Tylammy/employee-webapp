import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';

function ManageEmployee() {
  const [empid, setEmpid] = useState('');
  const [employee, setEmployee] = useState(null);
  const [jobTitles, setJobTitles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [form, setForm] = useState({ salary: '', job_title_id: '', division_id: '' });
  const [confirmationText, setConfirmationText] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/job-titles').then(res => res.json()).then(setJobTitles);
    fetch('http://localhost:5000/api/divisions').then(res => res.json()).then(setDivisions);
  }, []);

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:5000/api/employee/${empid}`);
    const data = await res.json();
    if (data.empid) {
      setEmployee(data);
      setForm({ salary: '', job_title_id: '', division_id: '' });
      setMessage('');
    } else {
      setEmployee(null);
      setMessage(data.error || 'Employee not found.');
    }
  };

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:5000/api/employees/update/${employee.empid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        salary: form.salary || employee.Salary,
        job_title_id: form.job_title_id || employee.job_title_id,
        division_id: form.division_id || employee.division_id,
      }),
    });
    const data = await res.json();
    setMessage(data.success ? 'Employee updated successfully.' : (data.error || 'Update failed.'));
  };

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:5000/api/employees/${employee.empid}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Employee deleted successfully.');
      setEmployee(null);
      setEmpid('');
      setConfirmationText('');
    } else {
      setMessage(data.error || 'Delete failed.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Manage Employee</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Enter Employee ID"
        value={empid}
        onChange={(e) => setEmpid(e.target.value)}
      />
      <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 mb-4">Search</button>

      {message && <p className="text-red-600">{message}</p>}

      {employee && (
        <>
          <div className="bg-white p-4 rounded shadow border mb-4">
            <p><strong>ID:</strong> {employee.empid}</p>
            <p><strong>Name:</strong> {employee.Fname} {employee.Lname}</p>
            <p><strong>Current Job:</strong> {employee.job_title}</p>
            <p><strong>Division:</strong> {employee.division_name}</p>
            <p><strong>Salary:</strong> ${employee.Salary}</p>
          </div>

          <div className="space-y-3">
            <input
              type="number"
              className="border p-2 w-full"
              placeholder={`New Salary (Leave blank to keep ${employee.Salary})`}
              value={form.salary}
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

            <div className="mt-4">
              <label className="block font-medium mb-1">Type DELETE to confirm deletion</label>
              <input
                className="border p-2 w-full"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
              />
              <button
                className={`mt-2 px-4 py-2 w-full text-white ${confirmationText === 'DELETE' ? 'bg-red-600' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={confirmationText !== 'DELETE'}
                onClick={handleDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ManageEmployee;