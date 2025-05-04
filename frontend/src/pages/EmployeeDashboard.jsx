import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmployeeDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'employee') {
      alert('Access denied: You are not authorized to view this page.');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
        <button
          className="bg-blue-600 text-white px-6 py-3"
          onClick={() => navigate('/employee/info')}
        >
          My Info
        </button>
        <button
          className="bg-green-600 text-white px-6 py-3"
          onClick={() => navigate('/employee/payroll')}
        >
          Pay History
        </button>
        <button
          className="bg-gray-600 text-white px-6 py-3"
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default EmployeeDashboard;

  