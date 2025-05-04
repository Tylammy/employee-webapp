import React from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';


function EmployeeDashboard() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome, Employee!</h1>
      <ul className="space-y-4">
        <li>
          <Link to="/employee/info" className="text-blue-600 underline">
            View My Info
          </Link>
        </li>
        <li>
          <Link to="/employee/payroll" className="text-blue-600 underline">
            View My Payroll History
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default EmployeeDashboard;

  