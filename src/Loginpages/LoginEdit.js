import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginEdit() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Extract safely
  const email = location.state?.email;
  const number = location.state?.number;

  // 1️⃣ Redirect if user enters manually
  useEffect(() => {
    if (!location.state) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  // 2️⃣ Fetch user by number
  useEffect(() => {
    if (!number) return;

    axios
      .get(`https://besravan11111.onrender.com/api/users/getbynumber/${number}`)
      .then((res) => {
        console.log("API Response:", res.data);
        setUser(res.data.data); // ✅ IMPORTANT FIX
      })
      .catch((err) => {
        console.error(err);
        alert("User not found!");
      });
  }, [number]);

  // 3️⃣ Delete user
  const deleteUser = () => {
    if (!window.confirm("Are you sure?")) return;

    axios
      .delete(`https://besravan11111.onrender.com/api/users/delete/${number}`)
      .then(() => {
        alert("User deleted successfully!");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        alert("Delete failed!");
      });
  };

  // 4️⃣ Navigate to update screen
  const updateUser = () => {
    navigate("/UpdateUser", { state: { number } });
  };

  if (!location.state) return null; // Prevent rendering before redirect

  return (
    <div style={styles.container}>
      <h2>Welcome User</h2>

      <div style={styles.box}>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Mobile Number:</strong> {number}</p>

        {user && (
          <>
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Customer ID:</strong> {user.customerId}</p>
          </>
        )}
      </div>

      <button
        style={{ ...styles.button, backgroundColor: "green" }}
        onClick={updateUser}
      >
        Update User
      </button>

      <button
        style={{ ...styles.button, backgroundColor: "red" }}
        onClick={deleteUser}
      >
        Delete User
      </button>

      <button style={{ ...styles.button }} onClick={() => navigate("/")}>
        Logout
      </button>
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "Arial",
  },
  box: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    textAlign: "left",
  },
  button: {
    marginTop: "20px",
    width: "100%",
    padding: "10px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#007bff",
  },
};

export default LoginEdit;
