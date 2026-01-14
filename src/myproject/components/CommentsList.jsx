import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/apiConfig';
import './CommentsList.css';

const CommentsList = ({ refreshTrigger }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/comments/approved`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        setError('');
      } else {
        setError('Failed to load comments');
      }
    } catch (error) {
      setError('Error loading comments');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [refreshTrigger]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="comments-section">
        <h3>Comments</h3>
        <div className="loading">Loading comments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comments-section">
        <h3>Comments</h3>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>
      
      {comments.length === 0 ? (
        <div className="no-comments">
          <p>No comments yet. Be the first to leave a comment!</p>
        </div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.name}</span>
                <span className="comment-date">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <div className="comment-content">
                {comment.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsList;