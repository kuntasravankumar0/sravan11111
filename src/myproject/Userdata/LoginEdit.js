import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginEdit.css";
import API_BASE_URL from "../config/apiConfig";
import Login from "./Login";

const USERS_API = `${API_BASE_URL}/api/users`;

function LoginEdit() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const number = location.state?.number;
  const isGoogleUser = location.state?.authProvider === "GOOGLE";
  const googleUser = isGoogleUser ? location.state : null;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("profile");

  const [popup, setPopup] = useState({
    update: false,
    delete: false,
    logout: false,
    custom: false,
    downloadData: false,
    changePassword: false,
  });

  // 🚫 Block direct access
  useEffect(() => {
    if (!location.state) {
      navigate("/login", { replace: true });
    }
  }, [location.state, navigate]);

  // ✅ Store Google user details
  useEffect(() => {
    if (isGoogleUser && googleUser) {
      localStorage.setItem(
        "googleUser",
        JSON.stringify({
          name: googleUser.name,
          email: googleUser.email,
          picture: googleUser.picture,
          emailVerified: googleUser.emailVerified,
          locale: googleUser.locale,
          authProvider: "GOOGLE",
        })
      );
    }
  }, [isGoogleUser, googleUser]);

  // 📡 Fetch normal user by number
  useEffect(() => {
    console.log("Fetching user by number:", number);
    if (!number) return;

    let alive = true;
    setLoading(true);

    axios
      .get(`${USERS_API}/getbynumber/${number}`)
      .then((res) => {
        console.log("User fetch response:", res.data);
        if (alive) setUser(res.data?.data || null);
      })
      .catch((error) => {
        console.error("User fetch error:", error);
        setMessage("❌ User not found");
        navigate("/", { replace: true });
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [number, navigate]);

  // ✅ Set header data
  useEffect(() => {
    if (isGoogleUser && googleUser) {
      localStorage.setItem(
        "headerUser",
        JSON.stringify({
          name: googleUser.name,
          email: googleUser.email,
          image: googleUser.picture || null,
        })
      );
      return;
    }

    if (user && email) {
      localStorage.setItem(
        "headerUser",
        JSON.stringify({
          name: user.username,
          email: email,
          image: null,
        })
      );
    }
  }, [isGoogleUser, googleUser, user, email]);

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await axios.delete(`${USERS_API}/delete/${number}`);
      localStorage.removeItem("googleUser");
      localStorage.removeItem("headerUser");
      navigate("/", { replace: true });
    } catch {
      setMessage("❌ Failed to delete user");
    } finally {
      setLoading(false);
      setPopup({ ...popup, delete: false });
    }
  };

  const handleUpdate = () => {
    navigate("/UpdateUser", { state: { number } });
  };

  const handleLogout = () => {
    localStorage.removeItem("googleUser");
    localStorage.removeItem("headerUser");
    navigate("/", { replace: true });
  };

  const handleDownloadData = () => {
    const userData = isGoogleUser && googleUser ? {
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
      emailVerified: googleUser.emailVerified,
      locale: googleUser.locale,
      authProvider: "GOOGLE",
      downloadDate: new Date().toISOString(),
    } : {
      username: user?.username,
      email: email,
      number: number,
      authProvider: user?.authProvider || "MANUAL",
      status: user?.status,
      latitude: user?.latitude,
      longitude: user?.longitude,
      downloadDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-data-${userData.email || userData.username}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setPopup({ ...popup, downloadData: false });
    setMessage("✅ User data downloaded successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  if (!location.state) return null;

  return (
    <div className="login-edit-container">
      {/* Enhanced CSS */}
      <style>{`
        .login-edit-container {
          min-height: 100vh;
          background: var(--bg-color);
          padding: 24px;
          font-family: inherit;
        }

        .dashboard-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          background: var(--card-bg);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-color);
        }

        .header-section {
          background: var(--primary-color);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }

        .welcome-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .welcome-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
        }

        .navigation-tabs {
          display: flex;
          background: var(--bg-color);
          border-bottom: 1px solid var(--border-color);
          padding: 0 20px;
        }

        .nav-tab {
          padding: 16px 24px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          color: var(--text-secondary);
          transition: var(--transition);
          border-bottom: 3px solid transparent;
        }

        .nav-tab.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
        }

        .nav-tab:hover:not(.active) {
          color: var(--text-primary);
          background: rgba(0,0,0,0.05);
        }

        .content-section {
          padding: 40px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .profile-card {
          background: var(--card-bg);
          border-radius: var(--radius-md);
          padding: 30px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
        }

        .google-profile {
          text-align: center;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin: 0 auto 20px;
          border: 4px solid var(--bg-color);
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }

        .profile-avatar:hover {
          transform: scale(1.05);
        }

        .default-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: var(--primary-color);
          margin: 0 auto 20px;
        }

        .profile-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .profile-email {
          color: var(--text-secondary);
          margin-bottom: 15px;
        }

        .verification-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .verified {
          background: #e6f4ea;
          color: #1e8e3e;
        }

        .unverified {
          background: #fce8e6;
          color: #d93025;
        }

        .info-grid {
          display: grid;
          gap: 15px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: var(--bg-color);
          border-radius: var(--radius-sm);
          border-left: 4px solid var(--primary-color);
        }

        .info-label {
          font-weight: 600;
          color: var(--text-primary);
        }

        .info-value {
          color: var(--text-secondary);
          font-family: inherit;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 30px;
        }

        .action-btn {
          padding: 16px 24px;
          border: none;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: var(--transition);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: center;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .btn-dashboard {
          background: var(--primary-color);
          color: white;
        }

        .btn-create {
          background: var(--google-green);
          color: white;
        }

        .btn-update {
          background: var(--google-blue);
          color: white;
        }

        .btn-delete {
          background: var(--google-red);
          color: white;
        }

        .btn-logout {
          background: var(--text-secondary);
          color: white;
        }

        .loading-state {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--bg-color);
          border-top: 4px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .message-alert {
          padding: 15px;
          border-radius: var(--radius-sm);
          margin-bottom: 20px;
          font-weight: 500;
        }

        .message-error {
          background: #fce8e6;
          color: #d93025;
          border: 1px solid #fad2cf;
        }

        .message-success {
          background: #e6f4ea;
          color: #1e8e3e;
          border: 1px solid #ceead6;
        }

        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .popup-box {
          width: 90%;
          max-width: 400px;
          padding: 30px;
          background: var(--card-bg);
          border-radius: var(--radius-lg);
          text-align: center;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
        }

        .popup-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .popup-message {
          color: var(--text-secondary);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .popup-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .popup-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .popup-btn-primary {
          background: var(--primary-color);
          color: white;
        }

        .popup-btn-danger {
          background: var(--google-red);
          color: white;
        }

        .popup-btn-secondary {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr; }
          .actions-grid { grid-template-columns: 1fr; }
          .navigation-tabs { flex-direction: column; padding: 0; }
          .content-section { padding: 24px; }
        }
      `}</style>

      <div className="dashboard-wrapper">
        {/* Header Section */}
        <div className="header-section">
          <h1 className="welcome-title">Welcome Back!</h1>
          <p className="welcome-subtitle">Manage your account and preferences</p>
        </div>

        {/* Navigation Tabs */}
        <div className="navigation-tabs">
          <button
            className={`nav-tab ${activeSection === "profile" ? "active" : ""}`}
            onClick={() => setActiveSection("profile")}
          >
            Profile
          </button>
          <button
            className={`nav-tab ${activeSection === "actions" ? "active" : ""}`}
            onClick={() => setActiveSection("actions")}
          >
            Actions
          </button>
          <button
            className={`nav-tab ${activeSection === "settings" ? "active" : ""}`}
            onClick={() => setActiveSection("settings")}
          >
            Settings
          </button>
        </div>

        {/* Content Section */}
        <div className="content-section">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading user information...</p>
            </div>
          )}

          {message && (
            <div className={`message-alert ${message.startsWith("❌") ? "message-error" : "message-success"}`}>
              {message}
            </div>
          )}

          {activeSection === "profile" && (
            <div className="profile-grid">
              {/* Profile Card */}
              <div className="profile-card">
                <div className="google-profile">
                  {isGoogleUser && googleUser ? (
                    <>
                      {googleUser.picture ? (
                        <img
                          src={googleUser.picture}
                          alt="Profile"
                          className="profile-avatar"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className="default-avatar">👤</div>
                      )}
                      <div className="profile-name">{googleUser.name}</div>
                      <div className="profile-email">{googleUser.email}</div>
                      <div className={`verification-badge ${googleUser.emailVerified ? "verified" : "unverified"}`}>
                        {googleUser.emailVerified ? "✓ Verified" : "⚠ Unverified"}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="default-avatar">👤</div>
                      <div className="profile-name">{user?.username || "User"}</div>
                      <div className="profile-email">{email}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Information Card */}
              <div className="profile-card">
                <h3 style={{ marginBottom: "20px", color: "#1f2937" }}>Account Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Auth Provider</span>
                    <span className="info-value">
                      <span className="status-badge verified">{isGoogleUser ? "GOOGLE" : (user?.authProvider || "MANUAL")}</span>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status</span>
                    <span className="info-value">
                      <span className={`status-badge ${user?.status === "ONLINE" || (isGoogleUser && googleUser) ? "verified" : "unverified"}`}>
                        {(isGoogleUser && googleUser) ? "ONLINE" : (user?.status || "OFFLINE")}
                      </span>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value" style={{ textAlign: 'right' }}>

                      {user?.latitude ? (
                        <span style={{ fontSize: '12px' }}>
                          {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
                        </span>
                      ) : (googleUser?.latitude ? (
                        <span style={{ fontSize: '12px' }}>
                          {googleUser.latitude.toFixed(4)}, {googleUser.longitude.toFixed(4)}
                        </span>
                      ) : "Location Not Available")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "actions" && (
            <div className="actions-grid">
              <button
                className="action-btn btn-dashboard"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
              <button
                className="action-btn btn-create"
                onClick={() => setPopup({ ...popup, custom: true })}
              >
                Create User
              </button>
              <button
                className="action-btn btn-update"
                onClick={() => setPopup({ ...popup, update: true })}
              >
                Update Profile
              </button>
              <button
                className="action-btn btn-delete"
                onClick={() => setPopup({ ...popup, delete: true })}
              >
                Delete Account
              </button>
              <button
                className="action-btn btn-logout"
                onClick={() => setPopup({ ...popup, logout: true })}
              >
                Logout
              </button>
            </div>
          )}
          <h3 class="dashboard-text">
            Click to
            <a href="/dashboard" class="dashboard-link">Dashboard</a>
          </h3>

          {activeSection === "settings" && (
            <div className="profile-card">
              <h3 style={{ marginBottom: "20px", color: "#1f2937" }}>Account Settings</h3>
              <p style={{ color: "#6b7280", marginBottom: "20px" }}>
                Manage your account preferences and security settings.
              </p>
              <div className="actions-grid">
                <button
                  className="action-btn btn-update"
                  onClick={() => navigate('/fix-my-speaker')}
                >
                  🔊 Fix My Speaker
                </button>
                <button className="action-btn btn-update">
                  Change Password
                </button>
                <button className="action-btn btn-update">
                  Privacy Settings
                </button>
                <button className="action-btn btn-update">
                  Notification Preferences
                </button>
                <button 
                  className="action-btn btn-delete"
                  onClick={() => setPopup({ ...popup, downloadData: true })}
                >
                  Download Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Enhanced Popups */}
      {popup.custom && (
        <div className="popup-overlay">
          <div className="popup-box" style={{ maxWidth: "600px" }}>
            <h3 className="popup-title">User Registration</h3>
            <Login />
            <div className="popup-buttons" style={{ marginTop: "20px" }}>
              <button
                className="popup-btn popup-btn-secondary"
                onClick={() => setPopup({ ...popup, custom: false })}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {popup.update && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3 className="popup-title">Update Profile</h3>
            <p className="popup-message">Do you want to update your profile information?</p>
            <div className="popup-buttons">
              <button
                className="popup-btn popup-btn-secondary"
                onClick={() => setPopup({ ...popup, update: false })}
              >
                Cancel
              </button>
              <button
                className="popup-btn popup-btn-primary"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {popup.delete && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3 className="popup-title">Delete Account</h3>
            <p className="popup-message">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="popup-buttons">
              <button
                className="popup-btn popup-btn-secondary"
                onClick={() => setPopup({ ...popup, delete: false })}
              >
                Cancel
              </button>
              <button
                className="popup-btn popup-btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {popup.logout && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3 className="popup-title">Logout</h3>
            <p className="popup-message">Are you sure you want to logout?</p>
            <div className="popup-buttons">
              <button
                className="popup-btn popup-btn-secondary"
                onClick={() => setPopup({ ...popup, logout: false })}
              >
                Cancel
              </button>
              <button
                className="popup-btn popup-btn-primary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {popup.downloadData && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3 className="popup-title">📥 Download User Data</h3>
            <p className="popup-message">
              Download your account information as a JSON file. This includes your profile data, settings, and account details.
            </p>
            <div className="popup-buttons">
              <button
                className="popup-btn popup-btn-secondary"
                onClick={() => setPopup({ ...popup, downloadData: false })}
              >
                Cancel
              </button>
              <button
                className="popup-btn popup-btn-primary"
                onClick={handleDownloadData}
              >
                📥 Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginEdit;