import React, { useState } from "react";
import Login from "./Login";
import "./UserCreatePopup.css";

function UserCreatePopup({ show, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!show && !isClosing) return null;

  return (
    <div 
      className={`popup-overlay ${isClosing ? 'closing' : ''}`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={`popup-box ${isClosing ? 'closing' : ''}`}>
        <div className="popup-header">
          <div className="header-content">
            <div className="user-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="header-text">
              <h3 className="popup-title">Create New Account</h3>
              <p className="popup-subtitle">User not found. Let's create your account</p>
            </div>
          </div>
          <button 
            className="close-btn" 
            onClick={handleClose}
            aria-label="Close popup"
          >
            ×
          </button>
        </div>

        <div className="popup-content">
          <Login onSuccess={handleClose} />
        </div>

        <div className="popup-footer">
          <button className="popup-close-btn" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCreatePopup;
