import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManageEmployee from './pages/ManageEmployee';
import PayrollHistory from './pages/PayrollHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/admin/manage-employees" element={<ManageEmployee />} />
        <Route path="/employee/payroll" element={<PayrollHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
