import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, Admin</h1>
      <ul className="list-disc pl-6 space-y-2">
        {/* Link to the Employee List page */}
        <li><Link to="/admin/employees" className="text-blue-600 hover:underline">View All Employees</Link></li>
        {/* You can add more admin features below */}
        <li><em>(More features coming soon: update employee, reports, etc.)</em></li>
      </ul>
    </div>
  );
}

export default AdminDashboard;
  