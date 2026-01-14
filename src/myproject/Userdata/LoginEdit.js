import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Login from "./Login";
import "./LoginEdit.css";
import { getUserByNumber, deleteUser } from "../../api/user/userApi";
import { deleteGoogleUser } from "../../api/auth/authApi";

function LoginEdit() {
  const location = useLocation();
  const navigate = useNavigate();

  const isGoogleUser = location.state?.authProvider === "GOOGLE";
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("profile");

  const [popup, setPopup] = useState({
    update: false,
    delete: false,
    logout: false,
    custom: false,
    downloadData: false,
  });

  // Sync to local and fetch latest
  useEffect(() => {
    if (!location.state) {
      navigate("/login", { replace: true });
      return;
    }

    if (isGoogleUser) {
      const stateUser = location.state;
      setUser(stateUser);
      localStorage.setItem("googleUser", JSON.stringify(stateUser));
      localStorage.setItem("headerUser", JSON.stringify({
        name: stateUser.name,
        email: stateUser.email,
        image: stateUser.picture,
        authProvider: "GOOGLE"
      }));
    } else {
      const { number } = location.state;
      getUserByNumber(number)
        .then(res => {
          const userData = res.data?.data || res.data;
          setUser(userData);
          localStorage.setItem("headerUser", JSON.stringify({
            name: userData.username,
            email: userData.useremail,
            image: null,
            authProvider: "MANUAL"
          }));
        })
        .catch(() => setMessage("❌ Failed to fetch profile details"));
    }
  }, [location.state, navigate, isGoogleUser]);

  const handleLogout = () => {
    localStorage.removeItem("googleUser");
    localStorage.removeItem("headerUser");
    navigate("/", { replace: true });
  };

  const handleDeleteAction = async () => {
    try {
      if (isGoogleUser) {
        await deleteGoogleUser(user.googleId);
      } else {
        await deleteUser(user.number);
      }
      handleLogout();
    } catch {
      setMessage("❌ Deletion failed");
    }
  };

  const handleDownloadData = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 1000;

    // Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 800, 1000);
    grad.addColorStop(0, "#4f46e5");
    grad.addColorStop(1, "#7c3aed");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1000);

    // Card background
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.roundRect(50, 50, 700, 900, 30);
    ctx.fill();

    // Text Content
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
    drawRow("Latitude", user?.latitude?.toString() || "N/A");
    drawRow("Longitude", user?.longitude?.toString() || "N/A");

    // verification
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 20px Arial";
    ctx.fillText("✓ VERIFIED USER", 100, y + 50);

    const link = document.createElement("a");
    link.download = `User-Identity-${user?.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
    setMessage("✅ Identity data downloaded!");
  };

  const getCustomerId = () => {
    if (user?.customerId) return user.customerId;
    if (user?.id) return "ID-" + user.id;
    return "ID-Pending";
  };

  return (
    <div className="login-edit-full-v2">
      <div className="le-background-glow"></div>

      <div className="le-container">
        {/* Header Section */}
        <div className="le-header">
          <div className="le-avatar-wrapper">
            <img
              src={user?.picture || "https://img.icons8.com/bubbles/200/000000/user.png"}
              alt="Profile"
              className="le-avatar"
              onError={(e) => e.target.src = "https://img.icons8.com/bubbles/200/000000/user.png"}
            />
            <div className={`le-status-dot ${user?.status === 'ONLINE' ? 'online' : 'offline'}`}></div>
          </div>
          <h1 className="le-welcome">Welcome Back, {user?.name || user?.username || "Explorer"}</h1>
          <p className="le-email-sub">{user?.email || user?.useremail}</p>
        </div>

        {/* Tab Navigation */}
        <div className="le-tabs">
          <button
            className={`le-tab-btn ${activeSection === "profile" ? "active" : ""}`}
            onClick={() => setActiveSection("profile")}
          >
            Profile Overview
          </button>
          <button
            className={`le-tab-btn ${activeSection === "actions" ? "active" : ""}`}
            onClick={() => setActiveSection("actions")}
          >
            Account Actions
          </button>
        </div>

        {/* Section Content */}
        <div className="le-content">
          {activeSection === "profile" ? (
            <div className="le-profile-grid">
              <div className="le-info-card">
                <span className="le-info-label">Identity ID</span>
                <span className="le-info-value highlight">{getCustomerId()}</span>
              </div>
              <div className="le-info-card">
                <span className="le-info-label">Auth Provider</span>
                <span className="le-info-value">{user?.authProvider || "MANUAL"}</span>
              </div>
              <div className="le-info-card">
                <span className="le-info-label">Mobile Reference</span>
                <span className="le-info-value">{user?.number || "N/A"}</span>
              </div>
              <div className="le-info-card">
                <span className="le-info-label">Current Status</span>
                <span className="le-info-value status-online">{user?.status || "ONLINE"}</span>
              </div>
              <div className="le-info-card full-width">
                <span className="le-info-label">Geospatial Location</span>

                <span className="le-info-value">
                  {user?.latitude ? `📍 ${user.latitude.toFixed(4)}, ${user.longitude.toFixed(4)}` : "❌ Coordinates not shared"}
                </span>
              </div>
              <div className="le-info-card">
                <span className="le-info-label">dashboard </span>
                <center>   <span className="le-info-value status-online"><a href="/dashboard">dashboard</a></span></center>
              </div>
            </div>
          ) : (
            <div className="le-actions-grid">
              <Link to="/dashboard" className="le-action-btn dashboard">
                <span className="icon">📊</span>
                <div className="text-wrap">
                  <span className="title">Go to Dashboard</span>
                  <span className="desc">View your activity & stats</span>
                </div>
              </Link>

              <button
                className="le-action-btn create"
                onClick={() => setPopup({ ...popup, custom: true })}
              >
                <span className="icon">👤</span>
                <div className="text-wrap">
                  <span className="title">Create User</span>
                  <span className="desc">Register a new sub-account</span>
                </div>
              </button>

              <Link
                to="/UpdateUser"
                state={{ number: user?.number }}
                className="le-action-btn update"
              >
                <span className="icon">✏️</span>
                <div className="text-wrap">
                  <span className="title">Update Profile</span>
                  <span className="desc">Edit your personal details</span>
                </div>
              </Link>

              <button
                className="le-action-btn download"
                onClick={handleDownloadData}
              >
                <span className="icon">📥</span>
                <div className="text-wrap">
                  <span className="title">Download Data</span>
                  <span className="desc">Get your identity card image</span>
                </div>
              </button>

              <button
                className="le-action-btn delete"
                onClick={() => setPopup({ ...popup, delete: true })}
              >
                <span className="icon">🗑️</span>
                <div className="text-wrap">
                  <span className="title">Delete Account</span>
                  <span className="desc">Permanently remove profile</span>
                </div>
              </button>

              <button
                className="le-action-btn logout"
                onClick={() => setPopup({ ...popup, logout: true })}
              >
                <span className="icon">🚪</span>
                <div className="text-wrap">
                  <span className="title">Secure Logout</span>
                  <span className="desc">End your current session</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {message && <div className="le-toast">{message}</div>}
      </div>

      {/* Popups */}
      {popup.custom && (
        <div className="le-popup-overlay">
          <div className="le-popup-box large">
            <div className="le-popup-head">
              <h3>Create New User</h3>
              <button className="close-btn" onClick={() => setPopup({ ...popup, custom: false })}>×</button>
            </div>
            <div className="le-popup-body scrollable">
              <Login />
            </div>
          </div>
        </div>
      )}

      {popup.logout && (
        <div className="le-popup-overlay">
          <div className="le-popup-box">
            <h3>Terminate Session?</h3>
            <p>You will need to sign back in to access your data.</p>
            <div className="le-popup-footer">
              <button className="btn-cancel" onClick={() => setPopup({ ...popup, logout: false })}>Cancel</button>
              <button className="btn-confirm logout" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {popup.delete && (
        <div className="le-popup-overlay">
          <div className="le-popup-box">
            <h3>Confirm Deletion</h3>
            <p className="warning">This action is permanent and cannot be reversed.</p>
            <div className="le-popup-footer">
              <button className="btn-cancel" onClick={() => setPopup({ ...popup, delete: false })}>Abort</button>
              <button className="btn-confirm delete" onClick={handleDeleteAction}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginEdit;