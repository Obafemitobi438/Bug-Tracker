// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const [bugs, setBugs] = useState([]);
  const [filteredBugs, setFilteredBugs] = useState([]);
  const [error, setError] = useState(null);
  const [newBug, setNewBug] = useState({ title: '', description: '', priority: '', status: 'Open', image: null });
  const [updateBugId, setUpdateBugId] = useState(null);
  const [updatedBug, setUpdatedBug] = useState({ title: '', description: '', priority: '', status: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const bugsPerPage = 5;

  const indexOfLastBug = currentPage * bugsPerPage;
  const indexOfFirstBug = indexOfLastBug - bugsPerPage;
  const currentBugs = filteredBugs.slice(indexOfFirstBug, indexOfLastBug);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/bug', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBugs(response.data);
      setFilteredBugs(response.data);
    } catch (error) {
      console.error('Error fetching bugs:', error);
      setError('Failed to load bugs. Please try again.');
      toast.error('Failed to fetch bugs.');
    }
  };

  const createBug = async () => {
    const formData = new FormData();
    formData.append('title', newBug.title);
    formData.append('description', newBug.description);
    formData.append('priority', newBug.priority);
    formData.append('status', newBug.status);
    if (newBug.image) formData.append('image', newBug.image);

    try {
      const response = await axios.post('http://localhost:3000/api/bug', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Bug created successfully!');
      setBugs([...bugs, response.data]);
      setFilteredBugs([...filteredBugs, response.data]);
      setNewBug({ title: '', description: '', priority: '', status: 'Open', image: null });
    } catch (error) {
      console.error('Error creating bug:', error);
      toast.error('Failed to create bug.');
    }
  };

  const updateBug = async (id) => {
    const formData = new FormData();
    formData.append('title', updatedBug.title);
    formData.append('description', updatedBug.description);
    formData.append('priority', updatedBug.priority);
    formData.append('status', updatedBug.status);
    if (updatedBug.image) formData.append('image', updatedBug.image);

    try {
      const response = await axios.put(`http://localhost:3000/api/bug/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Bug updated successfully!');
      setBugs(bugs.map((bug) => (bug._id === id ? response.data : bug)));
      setFilteredBugs(filteredBugs.map((bug) => (bug._id === id ? response.data : bug)));
      setUpdateBugId(null);
      setUpdatedBug({ title: '', description: '', priority: '', status: '' });
    } catch (error) {
      console.error('Error updating bug:', error);
      toast.error('Failed to update bug.');
    }
  };

  const deleteBug = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/bug/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Bug deleted successfully!');
      setBugs(bugs.filter((bug) => bug._id !== id));
      setFilteredBugs(filteredBugs.filter((bug) => bug._id !== id));
    } catch (error) {
      console.error('Error deleting bug:', error);
      toast.error('Failed to delete bug.');
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = bugs.filter(
      (bug) => bug.title.toLowerCase().includes(query) || bug.description.toLowerCase().includes(query)
    );
    setFilteredBugs(filtered);
  };

  const handlePriorityFilter = (event) => {
    const priority = event.target.value;
    setFilteredBugs(priority ? bugs.filter((bug) => bug.priority === priority) : bugs);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p>{error}</p>}
      <ToastContainer />

      <h3>Search Bugs</h3>
      <input
        type="text"
        placeholder="Search by title or description"
        value={searchQuery}
        onChange={handleSearch}
      />

      <h3>Filter by Priority</h3>
      <select onChange={handlePriorityFilter}>
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <h3>Create New Bug</h3>
      <input
        type="text"
        placeholder="Title"
        value={newBug.title}
        onChange={(e) => setNewBug({ ...newBug, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newBug.description}
        onChange={(e) => setNewBug({ ...newBug, description: e.target.value })}
      />
      <select
        value={newBug.priority}
        onChange={(e) => setNewBug({ ...newBug, priority: e.target.value })}
      >
        <option value="">Select Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input type="file" onChange={(e) => setNewBug({ ...newBug, image: e.target.files[0] })} />
      <button onClick={createBug}>Add Bug</button>

      {currentBugs.length > 0 ? (
        <ul>
          {currentBugs.map((bug) => (
            <li key={bug._id}>
              <strong>{bug.title}</strong>: {bug.description} - {bug.priority}
              {bug.image && (
                <img
                  src={`http://localhost:3000/${bug.image}`}
                  alt={bug.title}
                  style={{ width: '100px', height: '100px' }}
                />
              )}
              <button onClick={() => {
                setUpdateBugId(bug._id);
                setUpdatedBug({
                  title: bug.title,
                  description: bug.description,
                  priority: bug.priority,
                  status: bug.status,
                  image: null
                });
              }}>Edit</button>
              <button onClick={() => deleteBug(bug._id)}>Delete</button>

              {updateBugId === bug._id && (
                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={updatedBug.title}
                    onChange={(e) => setUpdatedBug({ ...updatedBug, title: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={updatedBug.description}
                    onChange={(e) => setUpdatedBug({ ...updatedBug, description: e.target.value })}
                  />
                  <select
                    value={updatedBug.priority}
                    onChange={(e) => setUpdatedBug({ ...updatedBug, priority: e.target.value })}
                  >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <input type="file" onChange={(e) => setUpdatedBug({ ...updatedBug, image: e.target.files[0] })} />
                  <button onClick={() => updateBug(bug._id)}>Save</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bugs found.</p>
      )}

      <button onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}>Previous</button>
      <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
    </div>
  );
}

export default Dashboard;
