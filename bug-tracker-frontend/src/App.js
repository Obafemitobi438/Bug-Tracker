// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected named import
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token validity on load and update authentication state
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { exp } = jwtDecode(token); // Corrected usage here
        if (Date.now() < exp * 1000) {
          setIsAuthenticated(true); // Token is valid, set authenticated
        } else {
          handleLogout(); // Token expired, logout user
        }
      } catch (error) {
        console.error('Invalid token', error);
        handleLogout(); // Invalid token, force logout
      }
    }
  }, []);

  // Logout function to remove token and update state
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={() => setIsAuthenticated(true)} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register onRegister={() => setIsAuthenticated(true)} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
