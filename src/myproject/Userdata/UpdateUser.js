import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateUser.css";
import API_BASE_URL from "../config/apiConfig";

const USERS_API = `${API_BASE_URL}/api/users`;

function UpdateUser() {
  const location = useLocation();
  const navigate = useNavigate();

  const number = location.state?.number;

  const [form, setForm] = useState({
    username: "",
    useremail: "",
    customerId: "",
    number: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("");
  const [progress, setProgress] = useState(0);

  // Block direct access
  useEffect(() => {
    if (!number) {
      navigate("/", { replace: true });
    }
  }, [number, navigate]);

  // Fetch user data
  useEffect(() => {
    if (!number) return;

    let isMounted = true;

    const fetchUser = async () => {
      setFetchLoading(true);
      setStep("Loading user information...");
      
      try {
        const res = await axios.get(`${USERS_API}/getbynumber/${number}`, {
          timeout: 10000
        });

        const data = res.data?.data;

        if (!data) {
          setMessage("❌ User not found");
          setTimeout(() => navigate("/", { replace: true }), 2000);
          return;
        }

        if (isMounted) {
          setForm({
            username: data.username || "",
            useremail: data.useremail || "",
            customerId: data.customerId || "",
            number: data.number || "",
          });
          setStep("User information loaded successfully");
        }
      } catch (err) {
        console.error("FETCH USER ERROR:", err);
        let errorMessage = "Failed to fetch user information";
        
        if (err.code === 'ECONNABORTED') {
          errorMessage = "Connection timeout. Please try again.";
        } else if (!navigator.onLine) {
          errorMessage = "No internet connection";
        }
        
        setMessage(`❌ ${errorMessage}`);
      } finally {
        if (isMounted) {
          setFetchLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [number, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.username.trim()) {
      newErrors.username = "Name is required";
    } else if (form.username.trim().length < 2) {
      newErrors.username = "Name must be at least 2 characters";
    }

    if (!form.useremail.trim()) {
      newErrors.useremail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.useremail.trim())) {
      newErrors.useremail = "Please enter a valid email address";
    }

    if (!form.number.trim()) {
      newErrors.number = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.number.trim())) {
      newErrors.number = "Mobile number must be exactly 10 digits";
    }

    if (!form.customerId.trim()) {
      newErrors.customerId = "Customer ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "number") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    setMessage("");
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);
    return interval;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validateForm()) {
      setMessage("Please fix the errors above");
      return;
    }

    setLoading(true);
    setStep("Validating information...");
    const progressInterval = simulateProgress();

    try {
      setStep("Updating your information...");
      
      await axios.put(`${USERS_API}/update/${number}`, form, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearInterval(progressInterval);
      setProgress(100);
      setStep("Information updated successfully!");
      setMessage("✅ User information updated successfully!");

      setTimeout(() => {
        navigate("/LoginEdit", {
          state: {
            email: form.useremail,
            number: form.number,
          },
        });
      }, 2000);
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error("UPDATE ERROR:", err);
      
      let errorMessage = "Failed to update user information";
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Connection timeout. Please try again.";
      } else if (err.response?.status === 409) {
        errorMessage = "Email or mobile number already exists";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection";
      }
      
      setMessage(`❌ ${errorMessage}`);
      setStep("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="update-container">
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <div className="loading-text">{step}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="update-container">
      <div className="update-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <h2>Update Your Information</h2>
        <p>Keep your account details up to date</p>
      </div>

      <form onSubmit={handleUpdate} className="update-form">
        <div className="input-group">
          <label htmlFor="username">Full Name</label>
          <div className="input-wrapper">
            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
              className={errors.username ? 'error' : ''}
              placeholder="Enter your full name"
              required
            />
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="useremail">Email Address</label>
          <div className="input-wrapper">
            <input
              id="useremail"
              type="email"
              name="useremail"
              value={form.useremail}
              onChange={handleChange}
              disabled={loading}
              className={errors.useremail ? 'error' : ''}
              placeholder="Enter your email address"
              required
            />
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
          </div>
          {errors.useremail && <span className="error-text">{errors.useremail}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="number">Mobile Number</label>
          <div className="input-wrapper">
            <input
              id="number"
              type="text"
              name="number"
              value={form.number}
              maxLength="10"
              onChange={handleChange}
              disabled={loading}
              className={errors.number ? 'error' : ''}
              placeholder="Enter 10-digit mobile number"
              required
            />
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </div>
          </div>
          {errors.number && <span className="error-text">{errors.number}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="customerId">Customer ID</label>
          <div className="input-wrapper">
            <input
              id="customerId"
              type="text"
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              disabled={loading}
              className={errors.customerId ? 'error' : ''}
              placeholder="Your customer ID"
              required
            />
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          {errors.customerId && <span className="error-text">{errors.customerId}</span>}
        </div>

        {loading && (
          <div className="loading-section">
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${progress}%`}}
                ></div>
              </div>
              <div className="progress-text">{progress}%</div>
            </div>
            <div className="step-text">{step}</div>
          </div>
        )}

        <button type="submit" disabled={loading} className="update-button">
          {loading ? (
            <>
              <div className="spinner"></div>
              Updating...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79 2.73 2.71 7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58 3.51-3.47 9.14-3.47 12.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"/>
              </svg>
              Update Information
            </>
          )}
        </button>
      </form>

      {message && (
        <div className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default UpdateUser;
