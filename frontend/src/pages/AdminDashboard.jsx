import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="bg-blue-600 text-white px-6 py-3" onClick={() => navigate('/admin/search')}>
          Search Employees
        </button>
        <button className="bg-red-600 text-white px-6 py-3" onClick={() => navigate('/admin/manage-employee')}>
          Manage Employees
        </button>
        <button className="bg-blue-600 text-white px-6 py-3" onClick={() => navigate('/admin/salary-adjust')}>
          Adjust Salaries
        </button>
        <button className="bg-blue-600 text-white px-6 py-3" onClick={() => navigate('/admin/employees')}>
          View Employee List
        </button>
        <button className="bg-blue-600 text-white px-6 py-3" onClick={() => navigate('/admin/payroll')}>
          View Payroll Reports
        </button>
        <button className="bg-blue-600 text-white px-6 py-3" onClick={() => {localStorage.clear(); navigate('/');}}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
