import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from "./theme";
import AdminSidebar from './main_components/admin/components/AdminSidebar';
import AdminTopbar from './main_components/admin/components/Topbar';
import Dashboard from "./main_components/admin/pages/dashboard/Dashboard";
import ManageAdminAcc from "./main_components/admin/pages/manage_admin/ManageAdminAcc";
import ManageAgentAcc from "./main_components/admin/pages/manage_agent/ManageAgentAcc";
import ManageBranches from "./main_components/admin/pages/manage_branches/ManageBranches";
import ManageEmployeeAcc from "./main_components/admin/pages/manage_employee/ManageEmployeeAcc";
import BackupRestore from "./main_components/admin/pages/backuprestore/BackupRestore";
import Reports from "./main_components/admin/pages/reports/Reports";
import Contacts from "./main_components/admin/pages/contacts/Contacts";
import Form from "./main_components/admin/pages/form/Form";
import Login from "./components/login_components/LoginForm"; // Import the Login component
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

const App = () => {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  // Admin-specific layout
  const AdminLayout = () => (
    <div className="app">
      <AdminSidebar />
      <main className="content">
        <AdminTopbar />
        <Routes>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/manageadminacc/*" element={<ManageAdminAcc />} />
          <Route path="/admin/manageagentacc" element={<ManageAgentAcc />} />
          <Route path="/admin/managebranches" element={<ManageBranches />} />
          <Route path="/admin/manageemployeeacc" element={<ManageEmployeeAcc />} />
          <Route path="/admin/backuprestore" element={<BackupRestore />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/contacts" element={<Contacts />} />
          <Route path="/admin/form" element={<Form />} />
        </Routes>
      </main>
    </div>
  );

  // Placeholder for other roles
  const RoleLayout = () => (
    <div>
      <h2>Welcome, {userRole}!</h2>
      <p>Templates for this role are coming soon.</p>
    </div>
  );

  return (
    <Router>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
            <Route path="/admin/dashboard//*" element={isAuthenticated ? (userRole === "admin" ? <AdminLayout /> : <RoleLayout />) : <Navigate to="/login" />} />
            {/* Other routes can be added for agent, employee, etc., once templates are ready */}
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Router>
  );
};

export default App;
