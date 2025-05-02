import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <ul className="space-y-4">
        <li>
          <Link to="/admin/employees" className="text-blue-600 underline">
            View All Employees
          </Link>
        </li>
        <li>
          <Link to="/admin/search" className="text-blue-600 underline">
            Search Employee
          </Link>
        </li>
        <li>
          <Link to="/admin/update" className="text-blue-600 underline">
            Update Employee Info
          </Link>
        </li>
        <li>
          <Link to="/admin/salary-adjust" className="text-blue-600 underline">
            Adjust Salaries by Percentage
          </Link>
        </li>
        <li>
          <Link to="/admin/payroll-report" className="text-blue-600 underline">
            View Payroll Reports
          </Link>
        </li>
        <li>
          <Link to="/admin/delete" className="text-blue-600 underline">
            Delete Employee
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminDashboard;

  