// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css'; // Custom styles

// Import Bootstrap CSS and optional JavaScript
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Optional Bootstrap JS

// Import Toastify CSS (for notifications)
import 'react-toastify/dist/ReactToastify.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
