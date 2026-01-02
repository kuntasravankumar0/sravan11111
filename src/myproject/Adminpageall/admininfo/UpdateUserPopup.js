import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";
import "./AdminPopups.css";

// single endpoint
const ADMIN_API = `${API_BASE_URL}/api/Adminaprovel`;

function UpdateUserPopup({ user, closePopup, refresh }) {
  const [adminname, setName] = useState(user.adminname || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState(""); // do NOT prefill password

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateUser = async () => {
    if (loading) return;

    const cleanName = adminname.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // -------- VALIDATION --------
    if (!cleanName) {
      setMessage("⚠ Name is required");
      return;
    }

    if (!cleanEmail) {
      setMessage("⚠ Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setMessage("⚠ Invalid email format");
      return;
    }

    if (cleanPassword && cleanPassword.length < 4) {
      setMessage("⚠ Password must be at least 4 characters");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        adminname: cleanName,
        email: cleanEmail,
      };

      // only send password if changed
      if (cleanPassword) {
        payload.password = cleanPassword;
      }

      await axios.put(
        `${ADMIN_API}/update/${user.customerId}`,
        payload
      );

      setMessage("✅ User updated successfully");
      refresh();

      setTimeout(() => {
        closePopup();
      }, 800);
    } catch (err) {
      console.error("UPDATE ERROR:", err?.message);
      setMessage("❌ Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h3>Update User</h3>

        {message && (
          <div className={`popup-message ${message.startsWith("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <div className="popup-input-group">
          <input
            value={adminname}
            onChange={(e) => {
              setName(e.target.value);
              setMessage("");
            }}
            className="popup-input"
            placeholder="Name *"
            disabled={loading}
          />
        </div>

        <div className="popup-input-group">
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage("");
            }}
            className="popup-input"
            placeholder="Email *"
            disabled={loading}
          />
        </div>

        <div className="popup-input-group">
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage("");
            }}
            className="popup-input"
            placeholder="New Password (optional)"
            type="password"
            disabled={loading}
          />
        </div>

        <div className="popup-actions">
          <button
            onClick={updateUser}
            className="popup-btn-primary"
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : "Update"}
          </button>

          <button
            onClick={closePopup}
            className="popup-btn-secondary"
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateUserPopup;
