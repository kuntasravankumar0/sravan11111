import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'https://besravan11111.onrender.com/api/users/create';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMobile = mobileNumber.trim();

    // --- VALIDATION ---
    if (!trimmedName || !trimmedEmail || !trimmedMobile) {
      setMessage("⚠ All fields are required.");
      return;
    }

    if (!/^\d{10}$/.test(trimmedMobile)) {
      setMessage("⚠ Mobile number must be exactly 10 digits.");
      return;
    }

    setMessage("Creating user...");
    setIsLoading(true);

    try {
      const postData = {
        username: trimmedName,
        useremail: trimmedEmail,
        number: trimmedMobile
      };

      const response = await axios.post(API_URL, postData);

      if (response.data?.status === true) {
        setMessage(`✅ User created successfully! Customer ID: ${response.data.customerId}`);
        setName('');
        setEmail('');
        setMobileNumber('');
      } else {
        const backendMessage = response.data?.message || "Unknown backend error.";

        if (backendMessage.includes("email")) {
          setMessage("⚠ ఈమెయిల్ ఇప్పటికే ఉంది (Email already exists).");
        } else if (backendMessage.includes("number")) {
          setMessage("⚠ మొబైల్ నెంబర్ ఇప్పటికే ఉంది (Mobile number already exists).");
        } else {
          setMessage(`❌ Failed: ${backendMessage}`);
        }
      }

    } catch (error) {
      console.error("API error:", error);

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
            onChange={(e) => { setName(e.target.value); setMessage(''); }}
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
            onChange={(e) => { setEmail(e.target.value); setMessage(''); }}
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
              const onlyNums = e.target.value.replace(/\D/g, '');
              setMobileNumber(onlyNums);
              setMessage('');
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
            cursor: isLoading ? 'not-allowed' : 'pointer'
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
              message.startsWith("✅") ? "#d4edda" :
              message.startsWith("⚠") ? "#fff3cd" :
              "#f8d7da",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "400px", margin: "50px auto", padding: "20px", borderRadius: "8px", border: "1px solid #ccc" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column" },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "4px" },
  button: { padding: "10px", border: "none", color: "white", background: "#007bff", borderRadius: "4px" },
  message: { marginTop: "15px", padding: "10px", borderRadius: "4px", textAlign: "center" }
};

export default Login;
