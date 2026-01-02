import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateAdminPopup from "./CreateAdminPopup";
import API_BASE_URL from "../../config/apiConfig";
import "./AdminLoginPage.css";

const ADMIN_API = `${API_BASE_URL}/api/Adminaprovel`;

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (loading) return;
    if (!email.trim() || !password.trim()) {
      setMessage("⚠ Email and password are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${ADMIN_API}/login`, { email, password });
      if (res.data === "Login successful") {
        localStorage.setItem("adminLoggedIn", "true");
        setMessage("✅ Login successful");
        setTimeout(() => navigate("/AdminHome", { replace: true }), 500);
      }
    } catch (err) {
      const msg = err.response?.data;
      if (msg === "Your account was rejected") setMessage("❌ Account REJECTED");
      else if (msg === "Waiting for approval") setMessage("⏳ PENDING approval");
      else if (msg === "Invalid password") setMessage("⚠ Invalid password");
      else if (msg === "User not found") setMessage("⚠ User not found");
      else setMessage("❌ Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <p className="subtitle">Secure access to administrative tools</p>

        <div className="admin-login-form">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage("");
            }}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage("");
            }}
            disabled={loading}
          />
          <button
            className="btn btn-primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : 'Sign In'}
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('✅') ? 'status-success' : 'status-error'}`}>
            {message}
          </div>
        )}

        <div className="footer-text">
          New admin?
          <span className="link-text" onClick={() => setShowPopup(true)}>
            Create Account
          </span>
        </div>
      </div>

      {showPopup && (
        <CreateAdminPopup closePopup={() => setShowPopup(false)} />
      )}
    </div>
  );
}

export default AdminLoginPage;
