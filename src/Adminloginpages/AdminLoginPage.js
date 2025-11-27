import React, { useState } from "react";
import axios from "axios";
import CreateAdminPopup from "./CreateAdminPopup";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState(false);





const handleLogin = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/Adminaprovel/login",
      { email, password }
    );

    if (res.data === "Login successful") {
      alert("Login Successful!");
      window.location.href = "/AdminHome";
    }

  } catch (err) {
    const msg = err.response?.data;

    if (msg === "Your account was rejected") {
      alert("❌ Your account was REJECTED by Admin!");
    } 
    else if (msg === "Waiting for approval") {
      alert("⏳ Your account is still PENDING approval!");
    } 
    else if (msg === "Invalid password") {
      alert("⚠ Invalid password");
    } 
    else if (msg === "User not found") {
      alert("⚠ User not found");
    } 
    else {
      alert("Unknown error occurred");
    }
  }
};









  return (
    <div style={styles.container}>
      <h2>Admin Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleLogin} style={styles.btn}>
        Login
      </button>

      <p style={{ marginTop: 20 }}>
        New admin?{" "}
        <span onClick={() => setPopup(true)} style={styles.link}>
          Create Account
        </span>
      </p>

      {popup && <CreateAdminPopup closePopup={() => setPopup(false)} />}
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
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  btn: {
    marginTop: 15,
    width: "100%",
    padding: 12,
    background: "#0066ff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  link: {
    color: "#0066ff",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default AdminLoginPage;
