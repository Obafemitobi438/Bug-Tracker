// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Register the user
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username,
        password,
      });
      alert(response.data.message); // Show success message
      setRegistrationSuccess(true);

      // Automatically log the user in after registration
      const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password,
      });

      // Save the token in local storage (if the response contains a token)
      if (loginResponse.data.token) {
        localStorage.setItem('token', loginResponse.data.token);
        
        // Redirect to the dashboard or protected route after successful login
        navigate('/dashboard'); // Update '/dashboard' to your protected route
      } else {
        alert('Login failed. Please try to log in manually.');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred while registering or logging in');
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          id="username"
          name="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          id="password"
          name="password"
        />
        <button type="submit">Register</button>
      </form>

      {/* Conditional rendering of the login link */}
      {registrationSuccess && (
        <div style={{ marginTop: '10px' }}>
          <p>Registration successful! Logging you in...</p>
        </div>
      )}
    </div>
  );
}

export default Register;
