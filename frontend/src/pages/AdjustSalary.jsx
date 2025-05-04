import React, { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

function AdjustSalary() {
  const [percent, setPercent] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAdjust = async () => {
    setMessage('');
    setError('');

    if (!percent || !min || !max) {
      setError('⚠️ Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/employees/adjust-salary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          percent: parseFloat(percent),
          minSalary: parseFloat(min),
          maxSalary: parseFloat(max),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Adjusted salaries for ${data.affectedRows} employee(s).`);
      } else {
        setError(data.error || '❌ Adjustment failed.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Server error.');
    }
  };

  return (
    <div className="p-6">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Adjust Salaries</h1>
      <div className="space-y-4 max-w-md">
        <input
          type="number"
          placeholder="Increase % (e.g., 3.2)"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Minimum Salary"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Maximum Salary"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          onClick={handleAdjust}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Apply Adjustment
        </button>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
}

export default AdjustSalary;
