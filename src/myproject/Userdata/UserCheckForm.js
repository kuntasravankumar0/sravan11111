import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./UserCheckForm.css";
import { syncGoogleUser } from "../../api/auth/authApi";
import { checkUser, createUser, updateUser as updateUserService } from "../../api/user/userApi";

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

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Panel switching functions
  const switchToSignUp = () => {
    if (containerRef.current) {
      containerRef.current.classList.add("right-panel-active");
      setMessage("");
    }
  };

  const switchToSignIn = () => {
    if (containerRef.current) {
      containerRef.current.classList.remove("right-panel-active");
      setMessage("");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setIsLoading(true);
      setMessage("⚡ Authenticating Google Profile...");

      const googleUser = {
        googleId: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        authProvider: "GOOGLE",
        status: "ONLINE"
      };

      const response = await syncGoogleUser(googleUser);

      if (response.data.status) {
        const savedUser = response.data.data;
        setMessage("✅ Success! Welcome " + savedUser.name);
        localStorage.setItem("headerUser", JSON.stringify({
          name: savedUser.name,
          email: savedUser.email,
          image: savedUser.picture,
          authProvider: "GOOGLE"
        }));
        localStorage.setItem("googleUser", JSON.stringify(savedUser));
        setTimeout(() => navigate("/LoginEdit", { state: { ...savedUser, authProvider: "GOOGLE" } }), 1000);
      }
    } catch (err) {
      setMessage("❌ Google Auth Failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateEmail(email) || !/^\d{10}$/.test(mobileNumber)) {
      setMessage("⚠ Please enter a valid email and 10-digit number");
      return;
    }

    setIsLoading(true);
    setMessage("🔍 Validating credentials...");

    try {
      const res = await checkUser(email, mobileNumber);
      const { type, data, message: serverMsg } = res.data;

      if (type === "both") {
        setMessage("✅ Login successful!");
        localStorage.setItem("headerUser", JSON.stringify({
          name: data.username,
          email: data.useremail,
          image: null,
          number: data.number,
          authProvider: "MANUAL"
        }));
        localStorage.setItem("userNumber", data.number);

        // Update to ONLINE
        await updateUserService(data.number, { ...data, status: "ONLINE" }).catch(e => console.error(e));

        setTimeout(() => navigate("/LoginEdit", { state: { ...data, authProvider: "MANUAL" } }), 1000);
      } else if (type === "mismatch") {
        setMessage("🛑 " + serverMsg);
      } else if (type === "email") {
        setMessage("🛑 This email is linked to another mobile number.");
      } else if (type === "number") {
        setMessage("🛑 This mobile number is linked to another email.");
      } else {
        setMessage("❓ Account not found. Would you like to Sign Up?");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server communication error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!signUpName || !validateEmail(signUpEmail) || !/^\d{10}$/.test(signUpMobile)) {
      setMessage("⚠ Please fill all fields correctly");
      return;
    }

    setIsLoading(true);
    setMessage("📝 Creating your account...");

    try {
      const res = await createUser({
        username: signUpName,
        useremail: signUpEmail,
        number: signUpMobile,
        status: "ONLINE",
        authProvider: "MANUAL"
      });

      if (res.data.status) {
        setMessage("✅ Account created successfully!");
        const userData = res.data.data;
        localStorage.setItem("headerUser", JSON.stringify({
          name: userData.username,
          email: userData.useremail,
          number: userData.number,
          authProvider: "MANUAL"
        }));
        localStorage.setItem("userNumber", userData.number);
        setTimeout(() => navigate("/LoginEdit", { state: { ...userData, authProvider: "MANUAL" } }), 1500);
      } else {
        setMessage("❌ " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      const errDetail = err.response?.data?.message || "Account creation failed.";
      setMessage("❌ " + errDetail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container" id="container" ref={containerRef}>
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUpSubmit}>
            <h1>Create Account</h1>
            <span>Join our professional network</span>
            <input type="text" placeholder="Full Name" value={signUpName} onChange={(e) => setSignUpName(e.target.value)} />
            <input type="email" placeholder="Email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} />
            <input type="text" placeholder="Number" value={signUpMobile} onChange={(e) => setSignUpMobile(e.target.value)} />
            <button type="submit" disabled={isLoading}>{isLoading ? "..." : "Sign Up"}</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleSignInSubmit}>
            <h1>Sign In</h1>
            <div className="google-btn-container">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setMessage("❌ Google Login Failed")} />
            </div>
            <span>or use your account</span>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
            <button type="submit" disabled={isLoading}>{isLoading ? "Wait..." : "Sign In"}</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>Keep connected with your personal info</p>
              <button className="ghost" onClick={switchToSignIn}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your details and start your journey</p>
              <button className="ghost" onClick={switchToSignUp}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
      {message && <div className={`status-toast ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}
    </div>
  );
}

export default UserCheckForm;
