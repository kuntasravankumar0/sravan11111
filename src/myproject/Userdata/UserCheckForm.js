import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import UserCreatePopup from "./UserCreatePopup";
import "./UserCheckForm.css";
import API_BASE_URL from "../config/apiConfig";

// ✅ endpoint defined ONCE
const USERS_API = `${API_BASE_URL}/api/users`;

function UserCheckForm() {
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // ---------------- GOOGLE LOGIN (ADDED ONLY) ----------------
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      // ✅ ALL POSSIBLE GOOGLE PROFILE DATA
      const googleUser = {
        googleId: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        emailVerified: decoded.email_verified,
        picture: decoded.picture,
        locale: decoded.locale || "",
        authProvider: "GOOGLE",
      };

      // auto-fill email for UX
      setEmail(googleUser.email);

      // navigate with Google info
      navigate("/LoginEdit", { state: googleUser });
    } catch (err) {
      console.error(err);
      setMessage("❌ Google Login Failed");
    }
  };

  // ---------------- EXISTING CODE (UNCHANGED) ----------------
  const handleCheck = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const cleanEmail = email.trim();
    const cleanMobile = mobileNumber.trim();

    if (!validateEmail(cleanEmail)) {
      setMessage("⚠ Enter a valid email address");
      return;
    }

    if (!/^\d{10}$/.test(cleanMobile)) {
      setMessage("⚠ Enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    setMessage("Checking user status... This may take 1 minute.");

    try {
      const response = await axios.get(`${USERS_API}/check`, {
        params: { email: cleanEmail, number: cleanMobile },
      });

      const { type } = response.data || {};

      if (type === "both") {
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
        setShowPopup(true);
        return;
      }

      setMessage("❌ Unexpected server response.");
    } catch (error) {
      setMessage("❌ Server error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="check-container">
      <h2>User Login</h2>

    

      {/* EXISTING FORM — UNCHANGED */}
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
            disabled={isLoading}
            required
          />
        </div>

        <div className="input-group">
          <label>Mobile Number:</label>
          <input
            type="text"
            value={mobileNumber}
            maxLength="10"
            onChange={(e) => {
              setMobileNumber(e.target.value.replace(/\D/g, ""));
              setMessage("");
            }}
            disabled={isLoading}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Checking..." : "Login"}
        </button>
      
      </form> 
    <hr />

       <center> {/* ✅ GOOGLE SIGN IN */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setMessage("❌ Google Login Failed")}
      /></center>

  

      {message && <p className="msg">{message}</p>}

      <button
        onClick={() => setShowPopup(true)}
        className="create-btn"
        disabled={isLoading}
      >
        Create User
      </button>

      <UserCreatePopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}

export default UserCheckForm;
