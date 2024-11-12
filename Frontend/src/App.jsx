import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from "./theme";
import AdminSidebar from './main_components/admin/components/AdminSidebar';
import AdminTopbar from './main_components/admin/components/AdminTopbar';
import AdminDashboard from "./main_components/admin/pages/dashboard/Dashboard";
import ManageAdminAcc from "./main_components/admin/pages/manage_admin/ManageAdminAcc";
import ManageAgentAcc from "./main_components/admin/pages/manage_agent/ManageAgentAcc";
import ManageBranches from "./main_components/admin/pages/manage_branches/ManageBranches";
import ManageEmployeeAcc from "./main_components/admin/pages/manage_employee/ManageEmployeeAcc";
import BackupRestore from "./main_components/admin/pages/backuprestore/BackupRestore";
import Reports from "./main_components/admin/pages/reports/Reports";
import Contacts from "./main_components/admin/pages/contacts/Contacts";
import Form from "./main_components/admin/pages/form/Form";
import AgentSidebar from "./main_components/agent/components/AgentSidebar";
import AgentTopbar from "./main_components/agent/components/AgentTopbar";
import Map from "./main_components/agent/pages/map/Map";
import ApprovedClient from "./main_components/agent/pages/clientlist/ApprovedClient";
import DeclinedClient from "./main_components/agent/pages/clientlist/DeclinedClient";
import CashierSidebar from "./main_components/cashier/components/CashierSidebar";
import CashierTopbar from "./main_components/cashier/components/CashierTopbar";
import PaymentApplication from "./main_components/cashier/pages/paymentapplication/PaymentApplication";
import CashierApprovedClient from "./main_components/cashier/pages/clientlist/ApprovedClient";
import Commision from "./main_components/cashier/pages/commision/Commision";
import InformationOfficerSidebar from "./main_components/information_officer/components/InformationOfficerSidebar";
import InformationOfficerTopbar from "./main_components/information_officer/components/InformationOfficerTopbar";
import InformationOfficerMap from "./main_components/information_officer/pages/map/Map";
import AgentList from "./main_components/information_officer/pages/agentlist/AgentList";
import InformationOfficerApprovedClient from "./main_components/information_officer/pages/clientlist/ApprovedClient";
import Login from "./components/login_components/LoginForm"; // Import the Login component
//import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

const App = () => {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState("");

  // Admin-specific layout
  const AdminLayout = () => (
    <div className="app">
      <AdminSidebar />
      <main className="content">
        <AdminTopbar />
        <Routes>
          <Route path="/admin/dashboard" index element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/manageadminacc" element={<ProtectedRoute><ManageAdminAcc /></ProtectedRoute>} />
          <Route path="/admin/manageagentacc" element={<ProtectedRoute><ManageAgentAcc /></ProtectedRoute>} />
          <Route path="/admin/managebranches" element={<ProtectedRoute><ManageBranches /></ProtectedRoute>} />
          <Route path="/admin/manageemployeeacc" element={<ProtectedRoute><ManageEmployeeAcc /></ProtectedRoute>} />
          <Route path="/admin/backuprestore" element={<ProtectedRoute><BackupRestore /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/admin/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
          <Route path="/admin/form" element={<ProtectedRoute><Form /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );

   // Agent-specific layout
   const AgentLayout = () => (
    <div className="app">
      <AgentSidebar />
      <main className="content">
        <AgentTopbar />
        <Routes>
          <Route path="/agent/map" index element={<ProtectedRoute><Map /></ProtectedRoute>} />
          <Route path="/agent/approvedclients" element={<ProtectedRoute><ApprovedClient /></ProtectedRoute>} />
          <Route path="/agent/declinedclients" element={<ProtectedRoute><DeclinedClient /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );

  
   // Cashier-specific layout
   const CashierLayout = () => (
    <div className="app">
      <CashierSidebar />
      <main className="content">
        <CashierTopbar />
        <Routes>
          <Route path="/cashier/paymentapplication" index element={<ProtectedRoute><PaymentApplication/></ProtectedRoute>} />
          <Route path="/cashier/approvedclients" element={<ProtectedRoute><CashierApprovedClient /></ProtectedRoute>} />
          <Route path="/cashier/commision" element={<ProtectedRoute><Commision /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );

  // InformationOfficer-specific layout
  const InformationOfficerLayout = () => (
    <div className="app">
      <InformationOfficerSidebar />
      <main className="content">
        <InformationOfficerTopbar />
        <Routes>
          <Route path="/information_officer/information-officer-map" index element={<ProtectedRoute><InformationOfficerMap/></ProtectedRoute>} />
          <Route path="/information_officer/agentlist" element={<ProtectedRoute><AgentList /></ProtectedRoute>} />
          <Route path="/information_officer/approvedclients" element={<ProtectedRoute><InformationOfficerApprovedClient/></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
            <Route
              path="*"
              element={
                isAuthenticated ? (
                  userRole === "admin" ? <AdminLayout />
                  : userRole === "agent" ? <AgentLayout />
                  : userRole === "cashier" ? <CashierLayout />
                  : userRole === "info_officer" ? <InformationOfficerLayout />
                  : <Navigate to="/login" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            {/* Redirect any unmatched route to /login if not authenticated */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/${userRole}" : "/login"} replace />} />
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Router>
  );
};

export default App;
