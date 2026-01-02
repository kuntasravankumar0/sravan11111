import React from "react";
import { Link } from "react-router-dom";
import "./UserDashboard.css";

export default function UserDashboard() {
  return (
    <div className="dashboard-wrapper">
      <h1>User Dashboard</h1>

      <div className="dashboard-grid">

        <Link to="/crick-links" className="dashboard-card">
          <div className="icon">🗂️</div>
          <h3>All Drive Links</h3>
          <p>View & search all available drive links</p>
        </Link>

        <Link to="/GetAllByCategory" className="dashboard-card">
          <div className="icon">web 🔗</div>

          <p>View links assigned to you</p>
        </Link>

        <p className="coming-soon">🚧 More exciting features coming soon!</p>

      </div>
    </div>
  );
}