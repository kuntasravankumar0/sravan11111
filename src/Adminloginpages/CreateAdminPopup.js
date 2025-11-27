import React, { useState } from "react";
import axios from "axios";

function CreateAdminPopup({ closePopup }) {
  const [adminname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // NEW

  const createAdmin = async () => {
    // Frontend Validation
    if (!adminname.trim()) return setError("Name is required");
    if (!email.trim()) return setError("Email is required");

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return setError("Invalid email format");

    if (!password.trim()) return setError("Password is required");
    if (password.length < 4)
      return setError("Password must be at least 4 characters");

    setError("");
    setLoading(true); // START loader

    try {
      const res = await axios.post(
        "https://besravan11111.onrender.com/api/Adminaprovel/register",
        { adminname, email, password }
      );

      alert(res.data);
      closePopup();
    } catch (err) {
      if (!err.response) {
        setError("❌ Backend offline. Start your Spring Boot server.");
      } else {
        setError(err.response.data || "Something went wrong");
      }
    } finally {
      setLoading(false); // STOP loader
    }
  };

  return (
    <div style={overlay}>
      <div style={popup}>
        <h3>Create Admin</h3>

        {error && (
          <p style={{ color: "red", marginBottom: 10, fontWeight: "bold" }}>
            {error}
          </p>
        )}

        <input
          placeholder="Name *"
          value={adminname}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button
          onClick={createAdmin}
          style={loading ? btnDisabled : btn}
          disabled={loading}
        >
          {loading ? <span className="loader"></span> : "Create Admin"}
        </button>

        <button onClick={closePopup} style={closeBtn}>
          Close
        </button>
      </div>

      {/* Loader CSS */}
      <style>
        {`
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
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

// --- STYLES ---

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

// Active button
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

// Disabled button during loading
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
