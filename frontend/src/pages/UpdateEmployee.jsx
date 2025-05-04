import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

function UpdateEmployee() {
  const [search, setSearch] = useState({ fname: '', lname: '', dob: '', ssn: '' });
  const [employee, setEmployee] = useState(null);
  const [jobTitles, setJobTitles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [form, setForm] = useState({ salary: '', job_title_id: '', division_id: '' });
  const [step, setStep] = useState('search');
  const [message, setMessage] = useState('');
  const [confirmUpdate, setConfirmUpdate] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/job-titles')
      .then(res => res.json())
      .then(data => setJobTitles(data));

    fetch('http://localhost:5000/api/divisions')
      .then(res => res.json())
      .then(data => setDivisions(data));
  }, []);

  const handleSearch = async () => {
    const query = new URLSearchParams(search).toString();
    const res = await fetch(`http://localhost:5000/api/employees/search?${query}`);
    const data = await res.json();
    if (data.length === 1) {
      setEmployee(data[0]);
      setForm({
        salary: '',
        job_title_id: '',
        division_id: ''
      });
      setStep('confirm');
      setMessage('');
    } else {
      setMessage('❌ Employee not found or multiple matches.');
    }
  };

  const handleUpdate = async () => {
    const updatedSalary = form.salary !== '' ? form.salary : employee.Salary;
    const updatedJob = form.job_title_id !== '' ? form.job_title_id : employee.job_title_id;
    const updatedDiv = form.division_id !== '' ? form.division_id : employee.div_ID;

    const res = await fetch(`http://localhost:5000/api/employees/update/${employee.empid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        salary: updatedSalary,
        job_title_id: updatedJob,
        division_id: updatedDiv
      })
    });
    const data = await res.json();
    if (data.success) {
      setMessage('✅ Employee updated successfully.');
    } else {
      setMessage('❌ Update failed.');
    }
    setStep('done');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Update Employee</h1>

      {step === 'search' && (
        <div className="space-y-4">
          <input className="border p-2 w-full" placeholder="First Name" value={search.fname} onChange={(e) => setSearch({ ...search, fname: e.target.value })} />
          <input className="border p-2 w-full" placeholder="Last Name" value={search.lname} onChange={(e) => setSearch({ ...search, lname: e.target.value })} />
          <input type="date" className="border p-2 w-full" value={search.dob} onChange={(e) => setSearch({ ...search, dob: e.target.value })} />
          <input className="border p-2 w-full" placeholder="SSN" value={search.ssn} onChange={(e) => setSearch({ ...search, ssn: e.target.value })} />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2">Search</button>
          {message && <p className="text-red-600">{message}</p>}
        </div>
      )}

      {step === 'confirm' && employee && (
        <div>
          <p className="mb-2">Found: <strong>{employee.Fname} {employee.Lname}</strong></p>
          <div className="flex gap-4">
            <button className="bg-green-600 text-white px-4 py-2" onClick={() => setStep('update')}>✅ Yes, Update</button>
            <button className="bg-gray-300 px-4 py-2" onClick={() => setStep('search')}>↩️ Go Back</button>
          </div>
        </div>
      )}

      {step === 'update' && employee && (
        <div className="space-y-4 mt-4">
          <input
            type="number"
            className="border p-2 w-full"
            placeholder={`Current: $${employee.Salary}`}
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />

          <select
            className="border p-2 w-full"
            value={form.job_title_id}
            onChange={(e) => setForm({ ...form, job_title_id: e.target.value })}
          >
            <option value="">Current: {employee.job_title || 'N/A'}</option>
            {jobTitles.map(jt => (
              <option key={jt.job_title_id} value={jt.job_title_id}>{jt.job_title}</option>
            ))}
          </select>

          <select
            className="border p-2 w-full"
            value={form.division_id}
            onChange={(e) => setForm({ ...form, division_id: e.target.value })}
          >
            <option value="">Current: {employee.division_name || 'N/A'}</option>
            {divisions.map(d => (
              <option key={d.ID} value={d.ID}>{d.Name}</option>
            ))}
          </select>

          {!confirmUpdate ? (
            <button className="bg-yellow-500 text-white px-4 py-2" onClick={() => setConfirmUpdate(true)}>Confirm Changes</button>
          ) : (
            <div className="space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2" onClick={handleUpdate}>Submit Update</button>
              <button className="bg-gray-400 px-4 py-2" onClick={() => setConfirmUpdate(false)}>Go Back</button>
            </div>
          )}
        </div>
      )}

      {step === 'done' && (
        <div>
          <p className="mt-4 text-blue-700 font-medium">{message}</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2" onClick={() => {
            setStep('search');
            setEmployee(null);
            setForm({ salary: '', job_title_id: '', division_id: '' });
            setMessage('');
            setConfirmUpdate(false);
          }}>
            🔁 Update Another Employee
          </button>
        </div>
      )}
    </div>
  );
}

export default UpdateEmployee;
