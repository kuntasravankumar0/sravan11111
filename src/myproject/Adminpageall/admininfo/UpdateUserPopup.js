import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";

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
    <div style={overlay}>
      <div style={popup}>
        <h3>Update User</h3>

        {message && (
          <p
            style={{
              marginBottom: 10,
              fontWeight: "bold",
              color: message.startsWith("✅") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}

        <input
          value={adminname}
          onChange={(e) => {
            setName(e.target.value);
            setMessage("");
          }}
          style={input}
          placeholder="Name *"
          disabled={loading}
        />

        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage("");
          }}
          style={input}
          placeholder="Email *"
          disabled={loading}
        />

        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage("");
          }}
          style={input}
          placeholder="New Password (optional)"
          type="password"
          disabled={loading}
        />

        <button
          onClick={updateUser}
          style={loading ? updateBtnDisabled : updateBtn}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>

        <button
          onClick={closePopup}
          style={closeBtn}
          disabled={loading}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const popup = {
  width: 350,
  padding: 20,
  background: "white",
  borderRadius: 10,
  boxShadow: "0px 0px 15px rgba(0,0,0,0.3)",
  textAlign: "center",
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const updateBtn = {
  marginTop: 15,
  width: "100%",
  padding: 10,
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const updateBtnDisabled = {
  ...updateBtn,
  background: "#6c757d",
  cursor: "not-allowed",
};

const closeBtn = {
  marginTop: 10,
  width: "100%",
  padding: 10,
  background: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

export default UpdateUserPopup;
