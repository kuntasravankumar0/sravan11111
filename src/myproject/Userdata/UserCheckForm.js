import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserCreatePopup from "./UserCreatePopup";
import "./UserCheckForm.css";

function UserCheckForm() {
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const API_BASE_URL = "https://besravan11111.onrender.com/api/users";
  const navigate = useNavigate();

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleCheck = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    const cleanMobile = mobileNumber.trim();

    // ---------------- VALIDATION ----------------
    if (!validateEmail(cleanEmail)) {
      setMessage("⚠ Enter a valid email address");
      return;
    }

    if (!/^\d{10}$/.test(cleanMobile)) {
      setMessage("⚠ Enter a valid 10-digit mobile number");
      return;
    }

    setMessage("Checking user status...");
    setIsLoading(true);

    try {
      const encodedEmail = encodeURIComponent(cleanEmail);
      const encodedNumber = encodeURIComponent(cleanMobile);

      const checkURL = `${API_BASE_URL}/check?email=${encodedEmail}&number=${encodedNumber}`;
      const response = await axios.get(checkURL);

      const type = response.data?.type;

      // ---------------- LOGIC ----------------
      if (type === "both") {
        setMessage("Welcome!");
        navigate("/LoginEdit", {
          state: { email: cleanEmail, number: cleanMobile },
        });
        return;
      }

      if (type === "email") {
        setMessage("🛑 Email exists but mobile number mismatched");
        return;
      }

      if (type === "number") {
        setMessage("🛑 Mobile number exists but email mismatched");
        return;
      }

      if (type === "none") {
        setMessage("❌ User not found. You can create a new user.");
        setShowPopup(true); // auto popup
        return;
      }

      setMessage("❌ Unexpected server response.");
    } catch (error) {
      console.error("CHECK ERROR:", error);
      setMessage("❌ Server error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="check-container">
      <h2>User Login</h2>

      <form onSubmit={handleCheck} className="check-form">
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage("");
            }}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label>Mobile Number:</label>
          <input
            type="text"
            value={mobileNumber}
            maxLength="10"
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              setMobileNumber(onlyNums);
              setMessage("");
            }}
            required
            disabled={isLoading}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Checking..." : "Login"}
        </button>
      </form>

      {message && (
        <p className={`msg ${
          message.startsWith("❌")
            ? "error"
            : message.startsWith("⚠")
            ? "warn"
            : "success"
        }`}>
          {message}
        </p>
      )}

      <button
        onClick={() => setShowPopup(true)}
        className="create-btn"
      >
        Create User
      </button>

      <UserCreatePopup show={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}

export default UserCheckForm;
