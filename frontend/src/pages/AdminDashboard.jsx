import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, Admin</h1>
        <ul className="list-disc pl-6 space-y-2">
          <li><Link to="/admin/employees" className="text-blue-600 hover:underline">View All Employees</Link></li>
          <li><Link to="/admin/search" className="text-blue-600 hover:underline">Search Employee</Link></li>
          <li><Link to="/admin/update" className="text-blue-600 hover:underline">Update Employee Information</Link></li>
          <li><Link to="/admin/salary-adjust" className="text-blue-600 hover:underline">Adjust Salaries by Percentage</Link></li>
          <li><Link to="/admin/payroll-report" className="text-blue-600 hover:underline">View Payroll Reports</Link></li>
          <li><Link to="/admin/delete" className="text-blue-600 hover:underline">Delete Employee</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
