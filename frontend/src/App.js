import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import SearchEmployee from './pages/SearchEmployee';
import EmployeeList from './pages/EmployeeList';
import UpdateEmployee from './pages/UpdateEmployee';
import AdjustSalary from './pages/AdjustSalary';
import PayrollReport from './pages/PayrollReport';
import DeleteEmployee from './pages/DeleteEmployee';
import EmployeeInfo from './pages/EmployeeInfo';
=======
>>>>>>> parent of e2e6300 (add pages)
=======
>>>>>>> parent of e2e6300 (add pages)
=======
>>>>>>> parent of e2e6300 (add pages)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        <Route path="/admin/search" element={<SearchEmployee />} />
        <Route path="/admin/update" element={<UpdateEmployee />} />
        <Route path="/admin/employees" element={<EmployeeList />} />
        <Route path="/admin/salary-adjust" element={<AdjustSalary />} />
        <Route path="/admin/payroll-report" element={<PayrollReport />} />
        <Route path="/admin/delete" element={<DeleteEmployee />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/info" element={<EmployeeInfo />} />
=======
>>>>>>> parent of e2e6300 (add pages)
=======
>>>>>>> parent of e2e6300 (add pages)
=======
>>>>>>> parent of e2e6300 (add pages)
      </Routes>
    </Router>
  );
}

export default App;
