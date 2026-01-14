import React, { useState } from 'react';
import CommentBox from './CommentBox';
import CommentsList from './CommentsList';
import './Footer.css';

const Footer = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCommentSubmit = () => {
    // Trigger refresh of comments list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About This Project</h3>
          <p>
            This is a modern web application built with React and Spring Boot, 
            featuring a complete comment system with approval workflow.
          </p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#admin">Admin Panel</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>Email: info@example.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Main St, City, State 12345</p>
        </div>
      </div>
      
      <div className="comments-section-wrapper">
        <CommentBox onCommentSubmit={handleCommentSubmit} />
        <CommentsList refreshTrigger={refreshTrigger} />
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;