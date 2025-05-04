import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';

function AdjustSalary() {
  const [percent, setPercent] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [message, setMessage] = useState('');

  const handleAdjust = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/employees/adjust-salary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percent, minSalary, maxSalary })
      });
      const data = await res.json();
      setMessage(data.success
        ? `✅ Updated ${data.affectedRows} employees`
        : '❌ Salary update failed.');
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error');
    }
  };

  return (
    <div className="p-6">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Adjust Salaries</h1>
      <div className="space-y-4 max-w-md">
        <input type="number" placeholder="% Increase" className="border p-2 w-full" value={percent} onChange={e => setPercent(e.target.value)} />
        <input type="number" placeholder="Min Salary" className="border p-2 w-full" value={minSalary} onChange={e => setMinSalary(e.target.value)} />
        <input type="number" placeholder="Max Salary" className="border p-2 w-full" value={maxSalary} onChange={e => setMaxSalary(e.target.value)} />
        <button onClick={handleAdjust} className="bg-blue-600 text-white px-4 py-2">Apply Adjustment</button>
        {message && <p className="text-blue-700">{message}</p>}
      </div>
    </div>
  );
}

export default AdjustSalary;
