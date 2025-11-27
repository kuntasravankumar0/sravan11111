import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateUser() {
  const location = useLocation();
  const navigate = useNavigate();

  const number = location.state?.number;

  const [form, setForm] = useState({
    username: "",
    useremail: "",
    customerId: "",
    number: ""
  });

  const [message, setMessage] = useState("");

  // 1️⃣ Load user data on page open
  useEffect(() => {
    axios
      .get(`https://besravan11111.onrender.com/api/users/getbynumber/${number}`)
      .then((res) => {
        const data = res.data.data;
        setForm({
          username: data.username,
          useremail: data.useremail,
          customerId: data.customerId,
          number: data.number
        });
      })
      .catch((err) => console.error(err));
  }, [number]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 2️⃣ Update user
  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`https://besravan11111.onrender.com/api/users/update/${number}`, form)
      .then((res) => {
        setMessage("User updated successfully! ✔");

        setTimeout(() => {
          navigate("/LoginEdit", {
            state: {
              email: form.useremail,
              number: form.number
            }
          });
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update user!");
      });
  };

  return (
    <div style={styles.container}>
      <h2>Update User</h2>

      <form onSubmit={handleUpdate} style={styles.form}>
        <label>Name:</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="useremail"
          value={form.useremail}
          onChange={handleChange}
          required
        />

        <label>Mobile Number:</label>
        <input
          type="text"
          name="number"
          value={form.number}
          onChange={handleChange}
          required
        />

        <label>Customer ID:</label>
        <input
          type="text"
          name="customerId"
          value={form.customerId}
          onChange={handleChange}
          required
        />

        <button type="submit" style={styles.button}>Update</button>
      </form>

      {message && <p style={styles.success}>{message}</p>}
    </div>
  );
}

// CSS
const styles = {
  container: {
    width: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    fontFamily: "Arial",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    marginTop: "15px",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "green",
    color: "white",
    cursor: "pointer",
  },
  success: {
    marginTop: "15px",
    color: "green",
    fontWeight: "bold",
    textAlign: "center"
  }
};

export default UpdateUser;
