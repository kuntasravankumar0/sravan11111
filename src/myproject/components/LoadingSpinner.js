import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading...", size = "medium" }) => {
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <div className="loading-message">{message}</div>
    </div>
  );
};

export default LoadingSpinner;