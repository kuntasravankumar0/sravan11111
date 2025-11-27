import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserCreatePopup from "./UserCreatePopup";

function UserCheckForm() {
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const API_BASE_URL = 'https://besravan11111.onrender.com/api/users';
  const navigate = useNavigate();

  const handleCheck = async (e) => {
    e.preventDefault();

    // ---------------- VALIDATIONS ----------------
    if (!email.includes("@") || !email.includes(".")) {
      setMessage("⚠ Enter a valid email address");
      return;
    }

    if (mobileNumber.length !== 10 || isNaN(mobileNumber)) {
      setMessage("⚠ Enter a valid 10-digit mobile number");
      return;
    }

    setMessage("Checking user status...");
    setIsLoading(true);

    try {
      // Encode email to prevent URL breaking
      const encodedEmail = encodeURIComponent(email.trim());

      const checkURL = `${API_BASE_URL}/check?email=${encodedEmail}&number=${mobileNumber}`;
      const response = await axios.get(checkURL);

      // console.log("CHECK RESPONSE:", response.data); // Debugging

      const type = response.data?.type;

      // ---------------- LOGIC ----------------

      if (type === "both") {
        setMessage("Welcome!");
        navigate("/LoginEdit", { state: { email, number: mobileNumber } });
        return;
      }

      if (type === "email") {
        setMessage("🛑 Email exists but mobile number does NOT match.");
        return;
      }

      if (type === "number") {
        setMessage("🛑 Mobile number exists but email does NOT match.");
        return;
      }

      if (type === "none") {
        setMessage("❌ User not found. You can create a new user.");
        setShowPopup(true); // Auto open popup
        return;
      }

      setMessage("❌ Unexpected server response.");

    } catch (error) {
      console.error("CHECK ERROR:", error);
      setMessage("❌ Server Error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <center><h2> User Login</h2></center>

      {/* ---------------- FORM ---------------- */}
      <form onSubmit={handleCheck} style={styles.form}>

        <div style={styles.inputGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setMessage(''); }}
            required
            style={styles.input}
            disabled={isLoading}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Mobile Number:</label>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => { setMobileNumber(e.target.value); setMessage(''); }}
            required
            maxLength="10"
            style={styles.input}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            backgroundColor: "#007bff",
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
          disabled={isLoading}
        >
          {isLoading ? "Checking..." : "Login"}
        </button>
      </form>

      {/* ---------------- MESSAGE ---------------- */}
      {message && (
        <p
          style={{
            ...styles.message,
            backgroundColor:
              message.startsWith('❌') ? '#f8d7da' :
              message.startsWith('⚠') ? '#fff3cd' :
              '#d4edda',
            color:
              message.startsWith('❌') ? '#721c24' :
              message.startsWith('⚠') ? '#856404' :
              '#155724'
          }}
        >
          {message}
        </p>
      )}

      {/* ---------------- POPUP BUTTON ---------------- */}
      <button
        onClick={() => setShowPopup(true)}
        style={{
          ...styles.button,
          backgroundColor: "green",
          marginTop: "10px"
        }}
      >
        Create User
      </button>

      {/* ---------------- POPUP ---------------- */}
      <UserCreatePopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
      />

    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Arial'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  button: {
    padding: '10px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  message: {
    marginTop: '15px',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid',
    textAlign: 'center'
  }
};

export default UserCheckForm;
