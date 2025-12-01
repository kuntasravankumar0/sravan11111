import React from "react";
import "./MoreOptions.css";

function MoreOptions() {
  return (
    <div className="more-options-container">
      <h2 className="more-options-title">More Options</h2>

      <div className="more-options-grid">
        
        {/* Login Page */}
        <a href="/UserCheckForm" className="more-option-card">
          <div className="icon-circle">👤</div>
          <div className="option-text">
            <h3>Login Page</h3>
            <p>User login page & data 💼</p>
          </div>
        </a>

        {/* Admin Page */}
        <a href="/AdminLoginPage" className="more-option-card">
          <div className="icon-circle">🛠️</div>
          <div className="option-text">
            <h3>Admin</h3>
            <p>Can handle user data 🛡️</p>
          </div>
        </a>

        {/* Links */}
        <a href="/GetAllByCategory" className="more-option-card">
          <div className="icon-circle">🔗</div>
          <div className="option-text">
            <h3>Links</h3>
            <p>View categorized links</p>
          </div>
        </a>

        {/* Help */}
        <a href="/Helpall" className="more-option-card">
          <div className="icon-circle">❓</div> {/* FIXED ICON */}
          <div className="option-text">
            <h3>Help</h3>
            <p>Support & assistance</p>
          </div>
        </a>

      </div>

      <p className="coming-soon-text">🚧 More exciting features coming soon!</p>
    </div>
  );
}

export default MoreOptions;
