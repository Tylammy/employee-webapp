import React, { useEffect, useState } from 'react';
import EmployeeNavbar from '../components/EmployeeNavbar';

function PayrollHistory() {
  const [payroll, setPayroll] = useState([]);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username');

  useEffect(() => {
    fetch(`http://localhost:5000/api/payroll-history?role=employee&username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPayroll(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('❌ Failed to load payroll history.');
      });
  }, [username]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <EmployeeNavbar />
      <h1 className="text-2xl font-bold mb-4">Payroll History</h1>

      {error && <p className="text-red-600">{error}</p>}

      {payroll.length === 0 && !error && (
        <p>No payroll records found.</p>
      )}

      {payroll.length > 0 && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Earnings</th>
              <th className="border p-2">Taxes</th>
              <th className="border p-2">Deductions</th>
              <th className="border p-2">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {payroll.map((p, index) => (
              <tr key={index} className="text-center border-b">
                <td className="border p-2">{p.pay_date?.substring(0, 10)}</td>
                <td className="border p-2">${Number(p.earnings).toFixed(2)}</td>
                <td className="border p-2">
                  ${(Number(p.fed_tax) + Number(p.fed_med) + Number(p.fed_SS) + Number(p.state_tax)).toFixed(2)}
                </td>
                <td className="border p-2">
                  ${(Number(p.retire_401k) + Number(p.health_care)).toFixed(2)}
                </td>
                <td className="border p-2 font-semibold">${Number(p.net_pay).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PayrollHistory;

