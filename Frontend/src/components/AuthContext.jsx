import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          console.log("Token expired. Refreshing...");
          await refreshToken();
        } else {
          setIsAuthenticated(true);
          setUser(decoded);
          localStorage.setItem("user", JSON.stringify(decoded));  // Store user data
        }
      } catch (error) {
        console.error("Invalid token", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/refresh-token', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        const decoded = jwtDecode(data.access_token);
        setIsAuthenticated(true);
        setUser(decoded);
        localStorage.setItem("user", JSON.stringify(decoded));  // Store user data
      } else {
        console.log("Refresh token failed");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error refreshing token", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();

    // Restore last visited page after login
    const lastPage = localStorage.getItem("last_page");
    if (lastPage && isAuthenticated) {
      navigate(lastPage);
    }
  }, []);

  // Save last visited page before refresh
  useEffect(() => {
    const saveLastPage = () => localStorage.setItem("last_page", window.location.pathname);
    window.addEventListener("beforeunload", saveLastPage);

    return () => {
      window.removeEventListener("beforeunload", saveLastPage);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};
