import React from 'react';
import { Link } from 'react-router-dom';

function AdminNavbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 mb-6">
      <div className="flex space-x-4">
        <Link to="/admin" className="hover:underline">Dashboard</Link>
        <Link to="/admin/search" className="hover:underline">Search</Link>
        <Link to="/admin/employees" className="hover:underline">Employees</Link>
        <Link to="/admin/salary-adjust" className="hover:underline">Adjust Salaries</Link>
        <Link to="/admin/payroll" className="hover:underline">Payroll</Link>
        <Link to="/admin/manage-employees" className="hover:underline">Manage Employees</Link>
        </div>
    </nav>
  );
}

export default AdminNavbar;