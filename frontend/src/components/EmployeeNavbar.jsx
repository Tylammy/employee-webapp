import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function EmployeeNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-blue-700 text-white">
      <div className="flex">
        <Link to="/employee/info" className="nav-button">My Info</Link>
        <Link to="/employee/payroll" className="nav-button">Pay History</Link>
        <button onClick={handleLogout} className="nav-button">Logout</button>
      </div>
    </nav>
  );
}

export default EmployeeNavbar;