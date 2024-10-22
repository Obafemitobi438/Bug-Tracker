import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BugList = () => {
    const [bugs, setBugs] = useState([]);

    useEffect(() => {
        const fetchBugs = async () => {
            try {
                const response = await axios.get('/api/bug');
                setBugs(response.data);
            } catch (error) {
                console.error('Error fetching bugs:', error);
            }
        };
        fetchBugs();
    }, []);

    return (
        <div>
            <h2>Bug List</h2>
            {bugs.map((bug) => (
                <div key={bug._id} style={{ marginBottom: '20px' }}>
                    <h3>{bug.title}</h3>
                    <p>{bug.description}</p>
                    <p>Priority: {bug.priority}</p>
                    <p>Status: {bug.status}</p>
                    {bug.image && (
                        <img 
                            src={`http://localhost:3000/${bug.image}`} 
                            alt={bug.title} 
                            style={{ maxWidth: '400px', maxHeight: '400px' }} 
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default BugList;
