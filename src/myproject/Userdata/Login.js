import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

// ✅ endpoint defined once
const CREATE_USER_API = `${API_BASE_URL}/api/users/create`;

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMobile = mobileNumber.trim();

    // ---------- validation ----------
    if (!trimmedName || !trimmedEmail || !trimmedMobile) {
      setMessage("⚠ All fields are required.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setMessage("⚠ Enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(trimmedMobile)) {
      setMessage("⚠ Mobile number must be exactly 10 digits.");
      return;
    }

    setIsLoading(true);
    setMessage("Creating user...");

    try {
      const payload = {
        username: trimmedName,
        useremail: trimmedEmail,
        number: trimmedMobile,
      };

      const response = await axios.post(
        CREATE_USER_API,
        payload
      );

      if (response.data?.status === true) {
        setMessage(
          `✅ User created successfully! Customer ID: ${response.data.customerId}`
        );
        setName("");
        setEmail("");
        setMobileNumber("");
        return;
      }

      const backendMessage =
        response.data?.message || "Unknown backend error";

      if (backendMessage.toLowerCase().includes("email")) {
        setMessage("⚠ ఈమెయిల్ ఇప్పటికే ఉంది (Email already exists)");
      } else if (backendMessage.toLowerCase().includes("number")) {
        setMessage("⚠ మొబైల్ నెంబర్ ఇప్పటికే ఉంది (Mobile number already exists)");
      } else {
        setMessage(`❌ Failed: ${backendMessage}`);
      }
    } catch (error) {
      console.error("CREATE USER ERROR:", error?.message);

      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage("❌ Network error. Check server or CORS.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>User Registration</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setMessage("");
            }}
            disabled={isLoading}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage("");
            }}
            disabled={isLoading}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Mobile Number:</label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => {
              setMobileNumber(e.target.value.replace(/\D/g, ""));
              setMessage("");
            }}
            disabled={isLoading}
            maxLength="10"
            style={styles.input}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...styles.button,
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Creating..." : "Create User"}
        </button>
      </form>

      {message && (
        <p
          style={{
            ...styles.message,
            backgroundColor:
              message.startsWith("✅")
                ? "#d4edda"
                : message.startsWith("⚠")
                ? "#fff3cd"
                : "#f8d7da",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  button: {
    padding: "10px",
    border: "none",
    color: "white",
    background: "#007bff",
    borderRadius: "4px",
  },
  message: {
    marginTop: "15px",
    padding: "10px",
    borderRadius: "4px",
    textAlign: "center",
  },
};

export default Login;
