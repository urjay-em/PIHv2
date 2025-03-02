import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from "./theme";
import './styles/client.css';

// Admin
import AdminSidebar from './main_components/admin/components/AdminSidebar';
import AdminTopbar from './main_components/admin/components/AdminTopbar';
import AdminDashboard from "./main_components/admin/pages/dashboard/Dashboard";
import ManageClientAcc from "./main_components/admin/pages/manage_client/ManageClientAcc";
import ManageAgentAcc from "./main_components/admin/pages/manage_agent/ManageAgentAcc";
import ManageBranches from "./main_components/admin/pages/manage_branches/ManageBranches";
import ManageEmployeeAcc from "./main_components/admin/pages/manage_employee/ManageEmployeeAcc";
import BackupRestore from "./main_components/admin/pages/backuprestore/BackupRestore";
import Register from "./main_components/admin/pages/register_acc/Register";
import AdminProfilePage from "./main_components/admin/pages/profile/AdminProfilePage";


// Agent
import AgentSidebar from "./main_components/agent/components/AgentSidebar";
import AgentDashboard from "./main_components/agent/pages/dashboard/AgentDashboard";
import AgentTopbar from "./main_components/agent/components/AgentTopbar";

import Map from "./main_components/agent/pages/map/Map";
import Client from "./main_components/agent/pages/clientlist/Client";
import Commissions from "./main_components/agent/pages/commission/Commissions";
import Performance from "./main_components/agent/pages/performance/Performance";
import Settings from "./main_components/agent/pages/settings/Settings"
import CommissionDetails from "./main_components/agent/pages/commission/CommissionDetails";



//Cashier
import CashierSidebar from "./main_components/cashier/components/CashierSidebar";
import CashierTopbar from "./main_components/cashier/components/CashierTopbar";
import PaymentApplication from "./main_components/cashier/pages/paymentapplication/PaymentApplication";
import CashierApprovedClient from "./main_components/cashier/pages/clientlist/ApprovedClient";
import Commission from "./main_components/cashier/pages/commission/Commission";
import CashierProfilePage from "./main_components/cashier/pages/profile/CashierProfilePage";

//Information Officer
import InformationOfficerSidebar from "./main_components/information_officer/components/InformationOfficerSidebar";
import InformationOfficerTopbar from "./main_components/information_officer/components/InformationOfficerTopbar";
import InformationOfficerMap from "./main_components/information_officer/pages/map/Map";
import AgentList from "./main_components/information_officer/pages/agentlist/AgentList";
import InformationOfficerApprovedClient from "./main_components/information_officer/pages/clientlist/ApprovedClient";
import InformationOfficerProfilePage from "./main_components/information_officer/pages/profile/InformationOfficerProfilePage";

//Client 

//import ClientSidebar from "./main_components/client/components/ClientSidebar";
//import ClientHeader from "./main_components/client/components/ClientHeader";
import Home from "./main_components/client/pages/home/Home";
import Setting from "./main_components/client/pages/settings/Setting";

import ClientMap from "./main_components/client/pages/map/ClientMap";



import Login from "./components/login_components/LoginForm";
import ResetPasswordPage from "./components/login_components/ResetPasswordPage";
import ResetPasswordConfirm from "./components/login_components/ResetPasswordConfirm";
import ActivatePage from "./components/login_components/ActivatePage";



const App = () => {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prevState => !prevState);
  };


  useEffect(() => {
    const loadRoleSpecificCSS = async () => {
      if (userRole) {
        try {
          await import(`./styles/${userRole.toLowerCase()}.css`);
          document.body.className = `${userRole.toLowerCase()}-interface`;
        } catch (error) {
          console.error("Failed to load role-specific CSS:", error);
        }
      } else {
        document.body.className = "default-interface";
      }
    };

    loadRoleSpecificCSS();

    // Cleanup on unmount
    return () => {
      document.body.className = "";
    };
  }, [userRole]);
  
  // Admin-specific layout
  const AdminLayout = () => (
    <div className="app">
      <AdminSidebar />
      <main className="content">
        <AdminTopbar />
        <Routes>
          <Route path="/admin/dashboard" index element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/manageagentacc" element={<ProtectedRoute><ManageAgentAcc /></ProtectedRoute>} />
          <Route path="/admin/manageclientacc" element={<ProtectedRoute><ManageClientAcc /></ProtectedRoute>} />
          <Route path="/admin/managebranches" element={<ProtectedRoute><ManageBranches /></ProtectedRoute>} />
          <Route path="/admin/manageemployeeacc" element={<ProtectedRoute><ManageEmployeeAcc /></ProtectedRoute>} />
          <Route path="/admin/backuprestore" element={<ProtectedRoute><BackupRestore /></ProtectedRoute>} />
          <Route path="/admin/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute><AdminProfilePage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );

   // Agent-specific layout
   const AgentLayout = () => (
    <div className="app">
      <AgentSidebar isCollapsed={isSidebarCollapsed}/>
      <main className="content">
        <AgentTopbar toggleSidebar={toggleSidebar}/>
        <Routes>
          <Route path="/agent/dashboard/*" index element={<ProtectedRoute> <AgentDashboard /></ProtectedRoute>} />
          <Route path="/agent/performance"  element={<ProtectedRoute><Performance /></ProtectedRoute>} />
          <Route path="/agent/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/agent/map" element={<ProtectedRoute><Map /></ProtectedRoute>} />
          <Route path="/agent/clients" element={<ProtectedRoute><Client /></ProtectedRoute>} />
          <Route path="/agent/commissions" element={<ProtectedRoute><Commissions /></ProtectedRoute>} />
          <Route path="/agent/commission-details" element={<ProtectedRoute><CommissionDetails /></ProtectedRoute>} />
          
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
          <Route path="/cashier/commission" element={<ProtectedRoute><Commission /></ProtectedRoute>} />
          <Route path="/cashier/profile" element={<ProtectedRoute><CashierProfilePage/></ProtectedRoute>} />
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
          <Route path="/information_officer/profile" element={<ProtectedRoute><InformationOfficerProfilePage/></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );

   // Client-specific layout
   const ClientLayout = () => (
    <div className="app">
      <ClientSidebar isCollapsed={isSidebarCollapsed}/>
      <main className="content">
        <ClientHeader toggleSidebar={toggleSidebar}/>
        <Routes>
          <Route path="/client/dashboard/*" index element={<ProtectedRoute> <Home /></ProtectedRoute>} />
          <Route path="/client/performance"  element={<ProtectedRoute><Performance /></ProtectedRoute>} />
          <Route path="/setting" element={<ProtectedRoute><Setting /></ProtectedRoute>} />
          <Route path="/client/map" element={<ProtectedRoute><ClientMap /></ProtectedRoute>} />
          
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
            {/* Auth routes */}
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
            <Route path="/activate/:uid/:token" element={<ActivatePage />} />
            <Route
              path="*"
              element={
                isAuthenticated ? (
                  userRole === "admin" ? <AdminLayout />
                  : userRole === "agent" ? <AgentLayout />
                  : userRole === "cashier" ? <CashierLayout />
                  : userRole === "information" ? <InformationOfficerLayout />
                  : userRole === "client" ? <ClientLayout />
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
