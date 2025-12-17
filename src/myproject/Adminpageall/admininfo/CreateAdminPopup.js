import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";

// ✅ single endpoint source
const ADMIN_API = `${API_BASE_URL}/api/Adminaprovel`;

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
      const res = await axios.post(
        `${ADMIN_API}/register`,
        {
          adminname: cleanName,
          email: cleanEmail,
          password: cleanPassword,
        }
      );

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
    <div style={overlay}>
      <div style={popup}>
        <h3>Create Admin</h3>

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
          placeholder="Name *"
          value={adminname}
          onChange={(e) => {
            setName(e.target.value);
            setMessage("");
          }}
          style={input}
          disabled={loading}
        />

        <input
          placeholder="Email *"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage("");
          }}
          style={input}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password *"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage("");
          }}
          style={input}
          disabled={loading}
        />

        <button
          onClick={createAdmin}
          style={loading ? btnDisabled : btn}
          disabled={loading}
        >
          {loading ? <span className="loader" /> : "Create Admin"}
        </button>

        <button onClick={closePopup} style={closeBtn} disabled={loading}>
          Close
        </button>
      </div>

      {/* Loader CSS */}
      <style>{`
        .loader {
          border: 3px solid #f3f3f3;
          border-top: 3px solid white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ---------- STYLES ---------- */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const popup = {
  width: 340,
  padding: 20,
  background: "#fff",
  borderRadius: 10,
  boxShadow: "0 0 15px rgba(0,0,0,0.3)",
  textAlign: "center",
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const btn = {
  width: "100%",
  padding: 12,
  marginTop: 15,
  background: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const btnDisabled = {
  ...btn,
  background: "#6c757d",
  cursor: "not-allowed",
};

const closeBtn = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  background: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
  
export default CreateAdminPopup;
