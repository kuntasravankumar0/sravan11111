import React from "react";
import { Link } from "react-router-dom";
import "./MoreOptions.css";

function MoreOptions({ onClose }) {
  return (
    <div className="more-options-container">
      <h2 className="more-options-title">More Options</h2>

      <div className="more-options-grid">

        {/* Login Page */}
        <Link to="/UserCheckForm" className="more-option-card" onClick={onClose}>
          <div className="icon-circle">👤</div>
          <div className="option-text">
            <h3>Login Page</h3>
            <p>User login page & data 💼</p>
          </div>
        </Link>

        {/* Admin Page */}
        <Link to="/AdminLoginPage" className="more-option-card" onClick={onClose}>
          <div className="icon-circle">🛠️</div>
          <div className="option-text">
            <h3>Admin Panel</h3>
            <p>System management & data ⚙️</p>
          </div>
        </Link>





      </div>

      <p className="coming-soon-text">🚧 More exciting features coming soon!</p>
      <p className="coming-soon-text">
        🚧 Please wait — Backend is starting. Initial load may take 1–2 minutes.
      </p>
    </div>
  );
}

export default MoreOptions;
