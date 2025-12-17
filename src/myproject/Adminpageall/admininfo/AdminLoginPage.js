import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateAdminPopup from "./CreateAdminPopup";
import API_BASE_URL from "../../config/apiConfig";

// single endpoint source
const ADMIN_API = `${API_BASE_URL}/api/Adminaprovel`;

function AdminLoginPage() {
  const navigate = useNavigate(); // 🔥 REQUIRED

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState(false);
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
      const res = await axios.post(
        `${ADMIN_API}/login`,
        { email, password }
      );

      if (res.data === "Login successful") {
        // ✅ mark admin as logged in
        localStorage.setItem("adminLoggedIn", "true");

        setMessage("✅ Login successful");

        // ✅ React Router navigation (NOT window.location)
        setTimeout(() => {
          navigate("/AdminHome", { replace: true });
        }, 500);
      }
    } catch (err) {
      const msg = err.response?.data;

      if (msg === "Your account was rejected") {
        setMessage("❌ Your account was REJECTED by Admin");
      } else if (msg === "Waiting for approval") {
        setMessage("⏳ Your account is still PENDING approval");
      } else if (msg === "Invalid password") {
        setMessage("⚠ Invalid password");
      } else if (msg === "User not found") {
        setMessage("⚠ User not found");
      } else {
        setMessage("❌ Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setMessage("");
        }}
        style={styles.input}
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setMessage("");
        }}
        style={styles.input}
        disabled={loading}
      />

      <button
        onClick={handleLogin}
        style={{
          ...styles.btn,
          opacity: loading ? 0.6 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && <p style={{ marginTop: 15 }}>{message}</p>}

      <p style={{ marginTop: 20 }}>
        New admin?{" "}
        <span
          onClick={() => setPopup(true)}
          style={styles.link}
        >
          Create Account
        </span>
      </p>

      {popup && (
        <CreateAdminPopup closePopup={() => setPopup(false)} />
      )}
    </div>
  );
}

const styles = {
  container: {
    margin: "50px auto",
    width: 350,
    padding: 20,
    background: "#fff",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
    borderRadius: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  btn: {
    marginTop: 15,
    width: "100%",
    padding: 12,
    background: "#0066ff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
  },
  link: {
    color: "#0066ff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default AdminLoginPage;
