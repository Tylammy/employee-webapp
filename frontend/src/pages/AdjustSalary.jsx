import React, { useState } from 'react';

function AdjustSalary() {
  const [percent, setPercent] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [eligibleEmployees, setEligibleEmployees] = useState([]);
  const [message, setMessage] = useState('');

  const handlePreview = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/employees/eligible-salary-adjustment?min=${minSalary}&max=${maxSalary}`
      );
      const data = await res.json();
      setEligibleEmployees(data);
      setMessage('');
    } catch (err) {
      console.error(err);
      setMessage('❌ Error loading preview');
    }
  };

  const handleAdjust = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/employees/adjust-salary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percent, minSalary, maxSalary })
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Adjusted salaries for ${data.affectedRows} employee(s).`);
        setEligibleEmployees([]);
      } else {
        setMessage('❌ ' + (data.error || 'Adjustment failed.'));
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error while adjusting salaries.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Adjust Salaries by Percentage</h1>
      <div className="space-y-4">
        <input
          type="number"
          step="0.1"
          placeholder="Adjustment % (e.g. 3.2 or -2.0)"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Minimum Salary"
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Maximum Salary"
          value={maxSalary}
          onChange={(e) => setMaxSalary(e.target.value)}
          className="border p-2 w-full"
        />

        <div className="flex gap-4">
          <button onClick={handlePreview} className="bg-yellow-500 text-white px-4 py-2">
            Preview Affected Employees
          </button>
          {eligibleEmployees.length > 0 && (
            <button onClick={handleAdjust} className="bg-green-600 text-white px-4 py-2">
              Confirm & Apply
            </button>
          )}
        </div>

        {message && <p className="mt-2 text-blue-700">{message}</p>}

        {eligibleEmployees.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Employees to be Adjusted:</h2>
            <table className="table-auto w-full border border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">ID</th>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Current Salary</th>
                  <th className="border px-2 py-1">New Salary</th>
                </tr>
              </thead>
              <tbody>
                {eligibleEmployees.map(emp => {
                  const newSalary = (emp.Salary * (1 + percent / 100)).toFixed(2);
                  return (
                    <tr key={emp.empid}>
                      <td className="border px-2 py-1">{emp.empid}</td>
                      <td className="border px-2 py-1">{emp.Fname} {emp.Lname}</td>
                      <td className="border px-2 py-1">{emp.email}</td>
                      <td className="border px-2 py-1">${Number(emp.Salary).toFixed(2)}</td>
                      <td className="border px-2 py-1 text-green-700 font-bold">${newSalary}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdjustSalary;

