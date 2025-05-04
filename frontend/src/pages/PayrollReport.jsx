import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';

function PayrollReport() {
    const [empid, setEmpid] = useState('');
    const [records, setRecords] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleSearch = async () => {
      setLoading(true);
      setError('');
      setRecords([]);
  
      try {
        const res = await fetch(`http://localhost:5000/api/payroll/${empid}`);
        const data = await res.json();
  
        if (res.ok) {
          setRecords(data);
        } else {
          setError(data.error || 'Failed to load payroll records.');
        }
      } catch (err) {
        console.error(err);
        setError('❌ Server error');
      }
  
      setLoading(false);
    };
  
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Payroll Report by Employee</h1>
        <div className="flex gap-4 mb-4">
        <AdminNavbar />
          <input
            type="text"
            placeholder="Enter Employee ID"
            value={empid}
            onChange={(e) => setEmpid(e.target.value)}
            className="border p-2"
          />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2">
            Load Payroll
          </button>
        </div>
  
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
  
        {records.length > 0 && (
          <table className="table-auto w-full border border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Earnings</th>
                <th className="border px-2 py-1">Fed Tax</th>
                <th className="border px-2 py-1">Medicare</th>
                <th className="border px-2 py-1">SS Tax</th>
                <th className="border px-2 py-1">State Tax</th>
                <th className="border px-2 py-1">401k</th>
                <th className="border px-2 py-1">Health</th>
                <th className="border px-2 py-1">Net Pay</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{row.pay_date?.substring(0, 10)}</td>
                  <td className="border px-2 py-1">${row.earnings.toFixed(2)}</td>
                  <td className="border px-2 py-1">${row.fed_tax.toFixed(2)}</td>
                  <td className="border px-2 py-1">${row.fed_med.toFixed(2)}</td>
                  <td className="border px-2 py-1">${row.fed_SS.toFixed(2)}</td>
                  <td className="border px-2 py-1">${row.state_tax.toFixed(2)}</td>
                  <td className="border px-2 py-1">${row.retire_401k.toFixed(2)}</td>
                  <td className="border px-2 py-1">${row.health_care.toFixed(2)}</td>
                  <td className="border px-2 py-1 font-bold text-green-700">
                    ${row.net_pay.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

export default PayrollReport;
