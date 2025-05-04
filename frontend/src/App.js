import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import SearchEmployee from './pages/SearchEmployee';
import EmployeeList from './pages/EmployeeList';
import AdjustSalary from './pages/AdjustSalary';
import EmployeeInfo from './pages/EmployeeInfo';
import PayrollDashboard from './pages/PayrollDashboard'; 
import ManageEmployee from './pages/ManageEmployee';
import PayrollHistory from './pages/PayrollHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/admin/search" element={<SearchEmployee />} />
        <Route path="/admin/employees" element={<EmployeeList />} />
        <Route path="/admin/salary-adjust" element={<AdjustSalary />} />
        <Route path="/employee/info" element={<EmployeeInfo />} />
        <Route path="/admin/payroll" element={<PayrollDashboard />} />
        <Route path="/admin/manage-employee" element={<ManageEmployee />} />
        <Route path="/employee/payroll" element={<PayrollHistory />} />
        </Routes>
    </Router>
  );
}

export default App;
