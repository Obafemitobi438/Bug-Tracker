import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddComment from './AddComment';

function BugDetails({ bugId }) {
  const [bug, setBug] = useState(null);

  useEffect(() => {
    const fetchBug = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/bug/${bugId}`);
        setBug(response.data);
      } catch (error) {
        console.error('Error fetching bug:', error);
      }
    };
    fetchBug();
  }, [bugId]);

  const handleCommentAdded = (comments) => {
    setBug({ ...bug, comments });
  };

  return (
    <div>
      {bug && (
        <>
          <h2>{bug.title}</h2>
          <p>{bug.description}</p>
          <h3>Comments:</h3>
          <ul>
            {bug.comments.map((comment, index) => (
              <li key={index}>
                <strong>{comment.author}</strong>: {comment.text}
              </li>
            ))}
          </ul>
          <AddComment bugId={bugId} onCommentAdded={handleCommentAdded} />
        </>
      )}
    </div>
  );
}

export default BugDetails;
