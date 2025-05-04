import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';


function DeleteEmployee() {
    const [empid, setEmpid] = useState('');
    const [message, setMessage] = useState('');
    const [confirming, setConfirming] = useState(false);
  
    const handleDelete = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employees/${empid}`, {
          method: 'DELETE'
        });
  
        const data = await res.json();
        if (data.success) {
          setMessage('✅ Employee deleted successfully.');
          setEmpid('');
          setConfirming(false);
        } else {
          setMessage('❌ ' + (data.error || 'Delete failed.'));
        }
      } catch (err) {
        console.error(err);
        setMessage('❌ Server error during deletion.');
      }
    };
  
    return (
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Delete Employee</h1>
        <AdminNavbar />
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={empid}
          onChange={(e) => setEmpid(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="bg-red-600 text-white px-4 py-2"
          >
            Proceed to Delete
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-red-700 font-medium">
              Are you sure you want to delete employee #{empid}?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-700 text-white px-4 py-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="bg-gray-300 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {message && <p className="mt-4 text-blue-700">{message}</p>}
      </div>
    );
  }

export default DeleteEmployee;
