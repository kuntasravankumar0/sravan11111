import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserDashboard.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats] = useState({
    activeTasks: 8,
    accountStatus: "Verified",
    lastLogin: "Just now"
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("googleUser") || localStorage.getItem("headerUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (err) {
        console.error("Error parsing user data", err);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleDownloadData = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 1000;

    const grad = ctx.createLinearGradient(0, 0, 800, 1000);
    grad.addColorStop(0, "#4f46e5");
    grad.addColorStop(1, "#7c3aed");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1000);

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.roundRect(50, 50, 700, 900, 30);
    ctx.fill();

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("USER IDENTITY CARD", 400, 150);

    ctx.font = "30px Arial";
    ctx.textAlign = "left";
    let y = 250;
    const drawRow = (label, val) => {
      ctx.fillStyle = "#64748b";
      ctx.fillText(label + ":", 100, y);
      ctx.fillStyle = "#1e293b";
      ctx.fillText(val || "N/A", 350, y);
      y += 80;
    };

    drawRow("Name", user?.name || user?.username);
    drawRow("Email", user?.email || user?.useremail);
    drawRow("Provider", user?.authProvider || "MANUAL");
    drawRow("ID", user?.customerId || ("ID-" + user?.id));
    drawRow("Number", user?.number || "N/A");
    drawRow("Status", user?.status || "ONLINE");

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 20px Arial";
    ctx.fillText("✓ VERIFIED USER", 100, y + 50);

    const link = document.createElement("a");
    link.download = `User-Identity-${user?.id || 'doc'}.png`;
    link.href = canvas.toDataURL();
    link.click();
    setMessage("✅ Identity data downloaded!");
  };

  const handleLogout = () => {
    localStorage.removeItem("googleUser");
    localStorage.removeItem("headerUser");
    localStorage.removeItem("lastLoginType");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-section">
        <div className="welcome-text">
          <h1>Welcome back, {user?.name || user?.username || "User"}! 👋</h1>
          <p>Here's what's happening with your account today.</p>
        </div>
        <button onClick={handleLogout} className="logout-btn-premium">
          Logout 🚪
        </button>
      </div>

      {message && (
        <div className="le-toast-p" style={{
          position: 'fixed', top: '100px', right: '20px',
          background: '#10b981', color: 'white', padding: '15px 25px',
          borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          zIndex: 1000, animation: 'slideIn 0.3s ease'
        }}>
          {message}
        </div>
      )}

      <div className="stats-row">
        <div className="stat-card-premium">
          <div className="stat-icon-wrapper green">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.activeTasks}</span>
            <span className="stat-label">Active Tasks</span>
          </div>
        </div>
        <div className="stat-card-premium">
          <div className="stat-icon-wrapper blue">🛡️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.accountStatus}</span>
            <span className="stat-label">Account Security</span>
          </div>
        </div>
        <div className="stat-card-premium">
          <div className="stat-icon-wrapper purple">🕒</div>
          <div className="stat-info">
            <span className="stat-value">{stats.lastLogin}</span>
            <span className="stat-label">Last Session</span>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="actions-section">
          <h2>Account Management Actions</h2>
          <div className="actions-grid">
            <Link
              to="/UpdateUser"
              state={{ number: user?.number }}
              className="action-card-premium update"
            >
              <div className="action-icon">✏️</div>
              <div className="action-details">
                <h3>Update Profile</h3>
                <p>Edit your personal details and account settings.</p>
              </div>
              <span className="arrow-icon">→</span>
            </Link>

            <Link to="/login" className="action-card-premium create">
              <div className="action-icon">➕</div>
              <div className="action-details">
                <h3>Create Account</h3>
                <p>Register a new user or secondary identity.</p>
              </div>
              <span className="arrow-icon">→</span>
            </Link>

            <div className="action-card-premium download" onClick={handleDownloadData} style={{ cursor: 'pointer' }}>
              <div className="action-icon">📥</div>
              <div className="action-details">
                <h3>Download Identity</h3>
                <p>Generate and save your official identity card.</p>
              </div>
              <span className="arrow-icon">→</span>
            </div>

            <div className="action-card-premium delete" onClick={() => navigate("/LoginEdit", { state: user })} style={{ cursor: 'pointer' }}>
              <div className="action-icon">🗑️</div>
              <div className="action-details">
                <h3>Advanced Settings</h3>
                <p>Access deletion, sync, and security defaults.</p>
              </div>
              <span className="arrow-icon">→</span>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="profile-preview-card">
            <div className="profile-banner"></div>
            <div className="profile-avatar-wrapper">
              <img src={user?.picture || user?.image || "https://img.icons8.com/bubbles/100/000000/user.png"} alt="User" />
            </div>
            <div className="profile-info-lite">
              <h3>{user?.name || user?.username || "Member"}</h3>
              <p>{user?.email || user?.useremail || "Check your settings"}</p>
            </div>
            <button onClick={() => navigate("/LoginEdit", { state: user })} className="edit-profile-btn">Edit Profile</button>
          </div>

          <div className="announcement-card">
            <div className="card-header">
              <h3>Live Updates 📢</h3>
            </div>
            <div className="announcement-list">
              <div className="announcement-item">
                <span className="dot blue"></span>
                <p>Added "Global Search" to resource management.</p>
              </div>
              <div className="announcement-item">
                <span className="dot green"></span>
                <p>Security scan completed: No issues found.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}