import React, { useState } from 'react';
import API_BASE_URL from '../config/apiConfig';
import './CommentBox.css';

const CommentBox = ({ onCommentSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.content.trim()) {
      setMessage('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.status) {
        setMessage('Comment submitted successfully! It will be visible after approval.');
        setFormData({ name: '', content: '' });
        if (onCommentSubmit) {
          onCommentSubmit();
        }
      } else {
        setMessage(result.message || 'Failed to submit comment');
      }
    } catch (error) {
      setMessage('Error submitting comment. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-box">
      <h3>Leave a Comment</h3>
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            maxLength="100"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Comment *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your comment here..."
            rows="4"
            maxLength="1000"
            required
          />
          <small className="char-count">
            {formData.content.length}/1000 characters
          </small>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentBox;