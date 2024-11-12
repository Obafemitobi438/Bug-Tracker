// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // No token found, redirect to login
    return <Navigate to="/login" />;
  }

  try {
    const { exp } = jwt_decode(token); // Decode token to get expiration time

    if (Date.now() >= exp * 1000) {
      // Token expired, clear it and redirect to login
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
    }
  } catch (error) {
    // Invalid token or decoding failed, clear storage and redirect
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }

  // Token is valid, allow access to the page
  return children;
}

export default ProtectedRoute;
