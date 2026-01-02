import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

const ROUTES = {
  USERS: "/UserTable",
  LINKS: "/LinksManager",
  CATEGORY: "/GetAllByCategory",
  ADMIN_DATA: "/AdminGetAllData",
  ADMIN_MANAGE: "/AdminManageUsers",
  Admincrick: "/Admincrick",
  FIXSPEAKER: "/fix-my-speaker",
  LOGIN: "/AdminLoginPage"
};

export default function AdminHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [navigate]);

  return (
    <div className="admin-home-container">
      <h1 className="admin-home-title">Admin Dashboard</h1>

      <div className="admin-grid">
        <div className="admin-action-card" onClick={() => navigate(ROUTES.USERS)}>
          <span className="admin-card-icon">👤</span>
          <h3>Manage Users</h3>
          <p>View, Edit & Delete Users</p>
        </div>

        <div className="admin-action-card" onClick={() => navigate(ROUTES.LINKS)}>
          <span className="admin-card-icon">🔗</span>
          <h3>Manage Links</h3>
          <p>Add, Update, Delete Links</p>
        </div>

        <div className="admin-action-card" onClick={() => navigate(ROUTES.CATEGORY)}>
          <span className="admin-card-icon">📂</span>
          <h3>View Links</h3>
          <p>Filter Links by Category</p>
        </div>

        <div className="admin-action-card" onClick={() => navigate(ROUTES.ADMIN_DATA)}>
          <span className="admin-card-icon">👮</span>
          <h3>Admin Approvals</h3>
          <p>View admin requests</p>
        </div>

        <div className="admin-action-card" onClick={() => navigate(ROUTES.ADMIN_MANAGE)}>
          <span className="admin-card-icon">🛠</span>
          <h3>Admin Management</h3>
          <p>Edit & control admin data</p>
        </div>

        <div className="admin-action-card" onClick={() => navigate(ROUTES.Admincrick)}>
          <span className="admin-card-icon">💾</span>
          <h3>Software Links</h3>
          <p>Manage free software downloads</p>
        </div>

        <div className="admin-action-card" onClick={() => navigate(ROUTES.FIXSPEAKER)}>
          <span className="admin-card-icon">🔊</span>
          <h3>Fix My Speaker</h3>
          <p>Audio-based repair tool</p>
        </div>

        <div className="admin-action-card coming-soon-card">
          <span className="admin-card-icon">🚀</span>
          <h3>Coming Soon</h3>
          <p>More features in development</p>
        </div>
      </div>
    </div>
  );
}
