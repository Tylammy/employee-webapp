import React, { useEffect, useState } from 'react';

function UpdateEmployee() {
  const [empid, setEmpid] = useState('');
  const [salary, setSalary] = useState('');
  const [jobTitleId, setJobTitleId] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [message, setMessage] = useState('');
  const [jobTitles, setJobTitles] = useState([]);
  const [divisions, setDivisions] = useState([]);

  // Fetch dropdown data
  useEffect(() => {
    fetch('http://localhost:5000/api/job-titles')
      .then(res => res.json())
      .then(data => setJobTitles(data));

    fetch('http://localhost:5000/api/divisions')
      .then(res => res.json())
      .then(data => setDivisions(data));
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/employees/update/${empid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salary, job_title_id: jobTitleId, division_id: divisionId })
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Employee updated successfully!');
      } else {
        setMessage('❌ ' + (data.error || 'Update failed.'));
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error updating employee.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Employee Info</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Employee ID"
          value={empid}
          onChange={(e) => setEmpid(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="New Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="border p-2 w-full"
        />

        <select
          value={jobTitleId}
          onChange={(e) => setJobTitleId(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Select Job Title</option>
          {jobTitles.map(jt => (
            <option key={jt.job_title_id} value={jt.job_title_id}>
              {jt.job_title}
            </option>
          ))}
        </select>

        <select
          value={divisionId}
          onChange={(e) => setDivisionId(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Select Division</option>
          {divisions.map(div => (
            <option key={div.ID} value={div.ID}>
              {div.Name}
            </option>
          ))}
        </select>

        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Update Employee
        </button>
        {message && <p className="mt-2 text-blue-700">{message}</p>}
      </div>
    </div>
  );
}

export default UpdateEmployee;
