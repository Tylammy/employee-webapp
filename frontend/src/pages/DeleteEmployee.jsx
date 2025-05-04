import React, { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

function DeleteEmployee() {
  const [empid, setEmpid] = useState('');
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearch = async () => {
    setError('');
    setEmployee(null);
    setSuccessMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/employee/${empid}`);
      const json = await res.json();
      if (json && json.empid) {
        setEmployee(json);
      } else {
        setError('Employee not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch employee.');
    }
  };

  const handleDelete = async () => {
    setError('');
    setSuccessMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/employee/${empid}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMessage('Employee successfully deleted.');
        setEmployee(null);
        setEmpid('');
        setConfirmation('');
      } else {
        setError(json.error || 'Failed to delete employee.');
      }
    } catch (err) {
      console.error(err);
      setError('Error deleting employee.');
    }
  };

  return (
    <div className="p-6">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Delete Employee</h1>

      <input
        type="text"
        placeholder="Enter Employee ID"
        value={empid}
        onChange={(e) => setEmpid(e.target.value)}
        className="border p-2 mb-4 block w-64"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 mb-4"
        onClick={handleSearch}
      >
        Search
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

      {employee && (
        <div className="bg-white p-4 border rounded shadow mb-4 w-full max-w-md">
          <p><strong>ID:</strong> {employee.empid}</p>
          <p><strong>Name:</strong> {employee.Fname} {employee.Lname}</p>
          <p><strong>Job Title:</strong> {employee.job_title}</p>

          <div className="mt-4">
            <label className="block mb-1 font-medium">
              Type <code>DELETE</code> to confirm
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          <button
            className={`mt-4 px-4 py-2 text-white ${
              confirmation === 'DELETE' ? 'bg-red-600' : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={confirmation !== 'DELETE'}
            onClick={handleDelete}
          >
            Confirm Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default DeleteEmployee;