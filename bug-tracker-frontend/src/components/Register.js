// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username,
        password,
      });
      alert(response.data.message); // Show success message
    } catch (error) {
      // Handle errors appropriately
      if (error.response) {
        alert(error.response.data.message); // Show error message from server
      } else {
        alert('An error occurred while registering');
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
          id="username" // Added id for better form handling
          name="username" // Added name for better form handling
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          id="password" // Added id for better form handling
          name="password" // Added name for better form handling
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
