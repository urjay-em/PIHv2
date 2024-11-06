import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from "./theme";
import AdminSidebar from './main_components/admin/components/AdminSidebar'
import AdminTopbar from './main_components/admin/components/Topbar'
import LoginForm from './components/login_components/LoginForm';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ClientDashboard from './components/dashboards/ClientDashboard';
import SignupForm from './components/login_components/Signupform';

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

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const RoleBasedRoute = ({ children, role, requiredRole }) => {
    if (role !== requiredRole) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm onShowSignup={() => alert("Go to signup")} />} />
            <Route path="/signup" element={<SignupForm />} />

            {/* Role-Based Protected Routes */}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute>
                <RoleBasedRoute role={userRole} requiredRole="admin">
                    <AdminDashboard />
                    <AdminTopbar />
                    <AdminSidebar />
                    
                    
                </RoleBasedRoute>
              </ProtectedRoute>
            } />

            <Route path="/client-dashboard" element={
              <ProtectedRoute>
                <RoleBasedRoute role={userRole} requiredRole="client">
                  <ClientDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            } />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
          
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Router>
  );
};

export default App;
