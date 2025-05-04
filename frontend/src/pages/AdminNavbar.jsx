// Naviation Bar
import React from 'react';
import { Link } from 'react-router-dom';


function AdminNavbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex flex-wrap gap-4 items-center">
      <Link to="/admin" className="hover:underline font-bold">
        Dashboard
      </Link>
      <Link to="/admin/employees" className="hover:underline">
        View Employees
      </Link>
      <Link to="/admin/search" className="hover:underline">
        Search
      </Link>
      <Link to="/admin/update" className="hover:underline">
        Update
      </Link>
      <Link to="/admin/salary-adjust" className="hover:underline">
        Adjust Salaries
      </Link>
      <Link to="/admin/payroll-report" className="hover:underline">
        Payroll Report
      </Link>
      <Link to="/admin/delete" className="hover:underline">
        Delete
      </Link>
    </nav>
  );
}

export default AdminNavbar;