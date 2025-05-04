import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="flex">
        <Link to="/admin" className="nav-button">Dashboard</Link>
        <Link to="/admin/search" className="nav-button">Search</Link>
        <Link to="/admin/manage-employee" className="nav-button">Manage Employees</Link>
        <Link to="/admin/employees" className="nav-button">View Employees</Link>
        <Link to="/admin/salary-adjust" className="nav-button">Adjust Salaries</Link>
        <Link to="/admin/payroll" className="nav-button">Payroll</Link>
        <button onClick={handleLogout} className="nav-button">Logout</button>
      </div>
    </nav>
  );
}

export default AdminNavbar;