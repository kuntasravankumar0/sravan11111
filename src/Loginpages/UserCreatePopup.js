// UserCreatePopup.js
import React from "react";
import Login from "./Login";

function UserCreatePopup({ show, onClose }) {
  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h3>User does not exist so create</h3>
          <Login />
        <button style={styles.button} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
popup: {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "350px",
  textAlign: "center",
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  marginTop: "30px"   // <-- ADD THIS
},
  button: {
    marginTop: "15px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default UserCreatePopup;
