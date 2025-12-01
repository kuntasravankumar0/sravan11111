import React from "react";
import Login from "./Login";
import "./UserCreatePopup.css";

function UserCreatePopup({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3 className="popup-title">User Not Found</h3>
        <p className="popup-subtitle">Create a new user below</p>

        <div className="popup-content">
          <Login />
        </div>

        <button className="popup-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default UserCreatePopup;
