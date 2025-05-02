import React, { useState } from 'react';

function SearchEmployee() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/employees/search?q=${query}`);
      const data = await res.json();
      setResults(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Search failed. Try again.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Search Employee</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter name, ID, or DOB"
          className="border p-2 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={handleSearch}>
          Search
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <table className="table-auto w-full border border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Salary</th>
          </tr>
        </thead>
        <tbody>
          {results.map(emp => (
            <tr key={emp.empid}>
              <td className="border px-4 py-2">{emp.empid}</td>
              <td className="border px-4 py-2">{emp.Fname} {emp.Lname}</td>
              <td className="border px-4 py-2">{emp.email}</td>
              <td className="border px-4 py-2">${emp.Salary.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SearchEmployee;
