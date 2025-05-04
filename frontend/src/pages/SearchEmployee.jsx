import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';

function SearchEmployee() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [empid, setEmpid] = useState('');
  const [dob, setDob] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const trimmedFname = fname.trim();
    const trimmedLname = lname.trim();
    const trimmedEmpid = empid.trim();
    const trimmedDob = dob.trim();
  
    if (!trimmedFname && !trimmedLname && !trimmedEmpid && !trimmedDob) {
      setError('⚠️ Please enter at least one search field.');
      setResults([]);
      return;
    }
  
    const query = new URLSearchParams({
      fname: trimmedFname,
      lname: trimmedLname,
      empid: trimmedEmpid,
      dob: trimmedDob
    }).toString();
  
    try {
      const res = await fetch(`http://localhost:5000/api/employees/search?${query}`);
      const data = await res.json();
  
      if (data.length === 0) {
        setError('❌ No employee found.');
        setResults([]);
      } else {
        setResults(data);
        setError('');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Server error. Try again.');
      setResults([]);
    }
  };  

  return (
    <div className="p-6">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Search Employee</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input type="text" placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} className="border p-2" />
        <input type="text" placeholder="Last Name" value={lname} onChange={(e) => setLname(e.target.value)} className="border p-2" />
        <input type="text" placeholder="Employee ID" value={empid} onChange={(e) => setEmpid(e.target.value)} className="border p-2" />
        <input type="date" placeholder="DOB" value={dob} onChange={(e) => setDob(e.target.value)} className="border p-2" />
      </div>

      <button className="bg-blue-600 text-white px-6 py-2 mb-4" onClick={handleSearch}>
        Search
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {results.length > 0 && (
        <table className="table-auto w-full border border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">DOB</th>
              <th className="border px-4 py-2">Salary</th>
              <th className="border px-4 py-2">Job Title</th>
              <th className="border px-4 py-2">Division</th>
            </tr>
          </thead>
          <tbody>
            {results.map(emp => (
              <tr key={emp.empid}>
                <td className="border px-4 py-2">{emp.empid}</td>
                <td className="border px-4 py-2">{emp.Fname} {emp.Lname}</td>
                <td className="border px-4 py-2">{emp.email}</td>
                <td className="border px-4 py-2">{emp.DOB?.substring(0, 10) || 'N/A'}</td>
                <td className="border px-4 py-2">${parseFloat(emp.Salary).toFixed(2)}</td>
                <td className="border px-4 py-2">{emp.job_title || 'N/A'}</td>
                <td className="border px-4 py-2">{emp.division_name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SearchEmployee;
