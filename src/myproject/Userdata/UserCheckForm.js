import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./UserCheckForm.css";
import API_BASE_URL from "../config/apiConfig";

// ✅ endpoint defined ONCE
const USERS_API = `${API_BASE_URL}/api/users`;

function UserCheckForm() {
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sign up form states
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpMobile, setSignUpMobile] = useState("");

  const navigate = useNavigate();
  const containerRef = useRef(null);

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Panel switching functions
  const switchToSignUp = () => {
    if (containerRef.current) {
      containerRef.current.classList.add("right-panel-active");
      setMessage(""); // Clear message when switching
    }
  };

  const switchToSignIn = () => {
    if (containerRef.current) {
      containerRef.current.classList.remove("right-panel-active");
      setMessage(""); // Clear message when switching
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setIsLoading(true);
      setMessage("Logging in with Google...");

      // Get geolocation
      let locationData = { latitude: null, longitude: null };
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } catch (geoErr) {
        console.warn("Geolocation failed:", geoErr);
      }

      const googleUser = {
        googleId: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        emailVerified: decoded.email_verified,
        picture: decoded.picture,
        locale: decoded.locale || "",
        authProvider: "GOOGLE",
        status: "ONLINE",
        ...locationData
      };

      const response = await axios.post(`${API_BASE_URL}/api/googleinfo`, googleUser);

      if (response.data.status) {
        setMessage("✅ Google Login Successful!");
        localStorage.setItem("headerUser", JSON.stringify({
          name: googleUser.name,
          email: googleUser.email,
          image: googleUser.picture,
          authProvider: "GOOGLE"
        }));
        localStorage.setItem("googleUser", JSON.stringify(googleUser));
        setTimeout(() => {
          navigate("/LoginEdit", { state: { ...googleUser, authProvider: "GOOGLE" } });
        }, 1500);
      } else {
        setMessage("❌ Failed to sync Google account");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Google Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- SIGN UP HANDLER ----------------
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const cleanEmail = signUpEmail.trim();
    const cleanMobile = signUpMobile.trim();
    const cleanName = signUpName.trim();

    if (!validateEmail(cleanEmail)) {
      setMessage("⚠ Enter a valid email address");
      return;
    }

    if (!/^\d{10}$/.test(cleanMobile)) {
      setMessage("⚠ Enter a valid 10-digit number");
      return;
    }

    if (!cleanName) {
      setMessage("⚠ Enter your name");
      return;
    }

    await createUserAndLogin(cleanEmail, cleanMobile, cleanName);
  };

  // ---------------- SIGN IN HANDLER ----------------
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const cleanEmail = email.trim();
    const cleanMobile = mobileNumber.trim();

    if (!validateEmail(cleanEmail)) {
      setMessage("⚠ Enter a valid email");
      return;
    }

    if (!/^\d{10}$/.test(cleanMobile)) {
      setMessage("⚠ Enter a 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    setMessage("Authenticating...");

    try {
      const response = await axios.get(`${USERS_API}/check`, {
        params: { email: cleanEmail, number: parseInt(cleanMobile) },
      });

      const { type } = response.data || {};

      if (type === "both") {
        setMessage("✅ Welcome back!");
        setTimeout(() => {
          navigate("/LoginEdit", { state: { email: cleanEmail, number: parseInt(cleanMobile) } });
        }, 1000);
      } else if (type === "email") {
        setMessage("🛑 Mobile number mismatch");
      } else if (type === "number") {
        setMessage("🛑 Email address mismatch");
      } else {
        setMessage("❌ Account not found. Try signing up!");
      }
    } catch (error) {
      setMessage("❌ Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- CREATE USER LOGIC ----------------
  const createUserAndLogin = async (email, number, username) => {
    try {
      setIsLoading(true);
      setMessage("Creating account...");
      const res = await axios.post(`${USERS_API}/create-simple`, {
        username, useremail: email, number
      });

      if (res.data.status) {
        setMessage("✅ Account created! Logging in...");
        setTimeout(() => {
          navigate("/LoginEdit", {
            state: { email, number: parseInt(number), isNewUser: true }
          });
        }, 1500);
      } else {
        setMessage("❌ Error: " + res.data.message);
      }
    } catch (err) {
      setMessage("❌ Account creation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container" id="container" ref={containerRef}>
        {/* SIGN UP */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUpSubmit}>
            <h1>Create Account</h1>
            <div className="social-container">
              <span style={{ marginBottom: '10px', display: 'block' }}>Join us today!</span>
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Mobile Number (10 digits)"
              value={signUpMobile}
              onChange={(e) => setSignUpMobile(e.target.value)}
            />
            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? "Processing..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* SIGN IN */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignInSubmit}>
            <h1>Sign In</h1>
            <div className="social-container">
              <div className="google-login-wrapper">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setMessage("❌ Google Login Failed")}
                  useOneTap
                  shape="pill"
                />
              </div>
            </div>
            <span>or use your registered email/mobile</span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? "Wait..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* OVERLAY */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="auth-btn ghost" onClick={switchToSignIn}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your details and start your journey with us</p>
              <button className="auth-btn ghost" onClick={switchToSignUp}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`status-message ${message.includes('✅') ? 'status-success' : message.includes('❌') || message.includes('🛑') ? 'status-error' : 'status-info'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default UserCheckForm;
