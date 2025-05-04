import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

function PayrollDashboard({ role = 'admin', username = '' }) {
  const [selectedReport, setSelectedReport] = useState('history');
  const [month, setMonth] = useState('');
  const [empid, setEmpid] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    let endpoint = '';
    let queryParams = '';

    switch (selectedReport) {
      case 'history':
        endpoint = '/api/payroll-history';
        queryParams =
          role === 'admin' && empid
            ? `?empid=${empid}&role=admin`
            : `?username=${username}&role=${role}`;
        break;
      case 'jobtitle':
        if (!month) {
          setError('Please select a month.');
          return;
        }
        endpoint = '/api/payroll-jobtitle';
        queryParams = `?month=${month}`;
        break;
      case 'division':
        if (!month) {
          setError('Please select a month.');
          return;
        }
        endpoint = '/api/payroll-division';
        queryParams = `?month=${month}`;
        break;
      default:
        return;
    }

    try {
      const res = await fetch(`http://localhost:5000${endpoint}${queryParams}`);
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        setError('');
      } else {
        setError(json.error || 'Error fetching data');
        setData([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
      setData([]);
    }
  };

  useEffect(() => {
    setData([]);
    setError('');
  }, [selectedReport]);

  const renderHistoryReport = () => {
    if (data.length === 0) return null;

    const grouped = {};
    data.forEach(row => {
      const id = row.empid;
      if (!grouped[id]) grouped[id] = { info: row, records: [] };
      grouped[id].records.push(row);
    });

    return (
      <div className="mt-6 bg-white p-4 rounded shadow border">
        <h2 className="text-lg font-semibold mb-4">Employee Payroll Summary</h2>

        {Object.entries(grouped).map(([id, { info, records }], idx) => (
          <div key={id} className="mb-10">
            {idx !== 0 && <hr className="my-6 border-gray-300" />}

            <p><strong>ID:</strong> {info.empid}</p>
            <p><strong>Name:</strong> {info.Fname} {info.Lname}</p>
            <p><strong>Job Title:</strong> {info.job_title}</p>

            <table className="table-auto w-full mt-4 border border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(records[0])
                    .filter(k => !['empid', 'Fname', 'Lname', 'job_title'].includes(k))
                    .map((key) => (
                      <th key={key} className="border px-4 py-2 capitalize">
                        {key.replace(/_/g, ' ')}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {records.map((row, idx2) => (
                  <tr key={idx2}>
                    {Object.entries(row)
                      .filter(([key]) => !['empid', 'Fname', 'Lname', 'job_title'].includes(key))
                      .map(([_, val], i) => (
                        <td key={i} className="border px-4 py-2">
                          {typeof val === 'string' && val.includes('T')
                            ? new Date(val).toLocaleDateString()
                            : val}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  };

  const renderSimpleTable = () => {
    if (data.length === 0) return null;

    return (
      <div className="mt-6 bg-white p-4 rounded shadow border">
        <h2 className="text-lg font-semibold mb-2">Report Results</h2>
        <table className="table-auto w-full border border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="border px-4 py-2 capitalize">
                  {key.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => (
                  <td key={i} className="border px-4 py-2">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Payroll Reports</h1>

      <select
        value={selectedReport}
        onChange={(e) => setSelectedReport(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="history">Employee Pay History</option>
        <option value="jobtitle">Total Pay by Job Title</option>
        <option value="division">Total Pay by Division</option>
      </select>

      {selectedReport === 'history' && role === 'admin' && (
        <input
          type="text"
          placeholder="Employee ID (optional)"
          value={empid}
          onChange={(e) => setEmpid(e.target.value)}
          className="border p-2 mb-4 block"
        />
      )}

      {(selectedReport === 'jobtitle' || selectedReport === 'division') && (
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 mb-4 block"
        >
          <option value="">Select a month</option>
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      )}

      <button className="bg-blue-600 text-white px-4 py-2" onClick={handleFetch}>
        Generate Report
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {selectedReport === 'history' ? renderHistoryReport() : renderSimpleTable()}

      {data.length === 0 && !error && (
        <p className="mt-6 text-gray-600">No results to display.</p>
      )}
    </div>
  );
}

export default PayrollDashboard;