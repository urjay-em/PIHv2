import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Optionally, check if token is expired using jwt-decode or a similar method
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/refresh-token', {
        method: 'POST',
        credentials: 'include', // Send the refresh token cookie
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error refreshing token', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('access_token');
      // Optionally check if token has expired and call refreshToken if necessary
      if (!token) {
        refreshToken(); // Refresh token if expired or missing
      }
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
