import React, { useState } from 'react';
import API_BASE_URL from '../config/apiConfig';
import './LinkSubmissionForm.css';

const LinkSubmissionForm = ({ onLinkSubmit }) => {
  const [formData, setFormData] = useState({
    linkname: '',
    categary: '',
    usenote: '',
    links: '',
    submittedBy: ''
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
    
    if (!formData.linkname.trim() || !formData.categary.trim() || !formData.links.trim()) {
      setMessage('Please fill in all required fields');
      return;
    }

    // Basic URL validation
    if (!formData.links.match(/^https?:\/\/.+/)) {
      setMessage('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/links/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Link submitted successfully! It will be visible after approval.');
        setFormData({
          linkname: '',
          categary: '',
          usenote: '',
          links: '',
          submittedBy: ''
        });
        if (onLinkSubmit) {
          onLinkSubmit();
        }
      } else {
        setMessage(result.message || 'Failed to submit link');
      }
    } catch (error) {
      setMessage('Error submitting link. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="link-submission-form">
      <h3>Submit a Link</h3>
      <form onSubmit={handleSubmit} className="link-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="linkname">Link Name *</label>
            <input
              type="text"
              id="linkname"
              name="linkname"
              value={formData.linkname}
              onChange={handleChange}
              placeholder="Enter link name"
              maxLength="200"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="categary">Category *</label>
            <input
              type="text"
              id="categary"
              name="categary"
              value={formData.categary}
              onChange={handleChange}
              placeholder="e.g., Technology, Education, Entertainment"
              maxLength="100"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="links">URL *</label>
          <input
            type="url"
            id="links"
            name="links"
            value={formData.links}
            onChange={handleChange}
            placeholder="https://example.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="usenote">Description</label>
          <textarea
            id="usenote"
            name="usenote"
            value={formData.usenote}
            onChange={handleChange}
            placeholder="Brief description of the link (optional)"
            rows="3"
            maxLength="500"
          />
          <small className="char-count">
            {formData.usenote.length}/500 characters
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="submittedBy">Your Name</label>
          <input
            type="text"
            id="submittedBy"
            name="submittedBy"
            value={formData.submittedBy}
            onChange={handleChange}
            placeholder="Enter your name (optional)"
            maxLength="100"
          />
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
          {isSubmitting ? 'Submitting...' : 'Submit Link'}
        </button>
      </form>
    </div>
  );
};

export default LinkSubmissionForm;