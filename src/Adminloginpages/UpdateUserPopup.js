import React, { useState } from "react";
import axios from "axios";

function UpdateUserPopup({ user, closePopup, refresh }) {
  const [adminname, setName] = useState(user.adminname);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);

  const updateUser = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/Adminaprovel/update/${user.customerId}`,
        { adminname, email, password }
      );

      alert("User updated Successfully!");
      refresh();
      closePopup();
    } catch (err) {
      alert("Error updating user!");
    }
  };

  return (
    <div style={overlay}>
      <div style={popup}>
        <h3>Update User</h3>

        <input
          value={adminname}
          onChange={(e) => setName(e.target.value)}
          style={input}
          placeholder="Name"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
          placeholder="Email"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
          placeholder="Password"
          type="password"
        />

        <button onClick={updateUser} style={updateBtn}>
          Update
        </button>

        <button onClick={closePopup} style={closeBtn}>
          Close
        </button>
      </div>
    </div>
  );
}

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
