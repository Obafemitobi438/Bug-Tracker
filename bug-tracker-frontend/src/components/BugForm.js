// src/components/BugForm.js
import React, { useState } from 'react';
import axios from 'axios';

function BugForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('Open');
  const [image, setImage] = useState(null); // State for the uploaded image

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Set the uploaded file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(); // Create a FormData object
    formData.append('title', title);
    formData.append('description', description);
    formData.append('priority', priority);
    formData.append('status', status);
    if (image) {
      formData.append('image', image); // Append the image file if available
    }

    try {
      await axios.post('http://localhost:3000/api/bug', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
          Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT token
        },
      });
      alert('Bug reported successfully!');
      // Clear the form after submission
      setTitle('');
      setDescription('');
      setPriority('Low');
      setStatus('Open');
      setImage(null);
    } catch (error) {
      console.error('Error reporting bug:', error);
      alert('Failed to report bug. Please try again.');
    }
  };

  return (
    <div>
      <h2>Report a Bug</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Bug Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Bug Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange} // Handle file selection
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default BugForm;
