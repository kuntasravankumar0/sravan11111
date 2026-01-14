import React, { useState } from "react";
import "./AdminPopups.css";
import { adminRegister } from "../../../api/auth/authApi";

function CreateAdminPopup({ closePopup }) {
  const [adminname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const createAdmin = async () => {
    if (loading) return;

    const cleanName = adminname.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // ---------- VALIDATION ----------
    if (!cleanName) return setMessage("⚠ Name is required");
    if (!cleanEmail) return setMessage("⚠ Email is required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail))
      return setMessage("⚠ Invalid email format");

    if (!cleanPassword)
      return setMessage("⚠ Password is required");

    if (cleanPassword.length < 4)
      return setMessage("⚠ Password must be at least 4 characters");

    setMessage("");
    setLoading(true);

    try {
      const res = await adminRegister({
        adminname: cleanName,
        email: cleanEmail,
        password: cleanPassword,
      });

      setMessage(`✅ ${res.data}`);
      setTimeout(() => closePopup(), 1200);
    } catch (err) {
      if (!err.response) {
        setMessage("❌ Backend offline. Start Spring Boot server.");
      } else {
        setMessage(err.response.data || "❌ Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h3>Create Admin</h3>

        {message && (
          <div className={`popup-message ${message.startsWith("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <div className="popup-input-group">
          <input
            placeholder="Name *"
            value={adminname}
            onChange={(e) => {
              setName(e.target.value);
              setMessage("");
            }}
            className="popup-input"
            disabled={loading}
          />
        </div>

        <div className="popup-input-group">
          <input
            placeholder="Email *"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage("");
            }}
            className="popup-input"
            disabled={loading}
          />
        </div>

        <div className="popup-input-group">
          <input
            type="password"
            placeholder="Password *"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage("");
            }}
            className="popup-input"
            disabled={loading}
          />
        </div>

        <div className="popup-actions">
          <button
            onClick={createAdmin}
            className="popup-btn-primary"
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : "Create Admin"}
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

export default CreateAdminPopup;
