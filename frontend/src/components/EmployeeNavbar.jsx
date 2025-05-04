import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

function EmployeeNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-blue-700 text-white p-3 mb-4">
      <ul className="flex space-x-4">
        <li><Link to="/employee/info">My Info</Link></li>
        <li><Link to="/employee/payroll">Pay History</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default EmployeeNavbar;
