import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { createUser } from "../../api/user/userApi";

function Login({ onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Mobile number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'mobileNumber' ? value.replace(/\D/g, '') : value
    }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
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

  const handleSubmitAction = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateForm()) {
      setMessage("Please fix the errors above");
      return;
    }

    setIsLoading(true);
    setStep("Validating information...");
    const progressInterval = simulateProgress();

    try {
      setStep("Creating your account...");

      const payload = {
        username: formData.name.trim(),
        useremail: formData.email.trim(),
        number: formData.mobileNumber.trim(),
      };

      const response = await createUser(payload);

      clearInterval(progressInterval);
      setProgress(100);
      setStep("Account created successfully!");

      if (response.data?.status === true) {
        setMessage(`✅ Account created successfully! Customer ID: ${response.data.customerId}`);

        // Reset form
        setFormData({
          name: "",
          email: "",
          mobileNumber: ""
        });

        // Call success callback if provided
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
        return;
      }

      const backendMessage = response.data?.message || "Unknown backend error";

      if (backendMessage.toLowerCase().includes("email")) {
        setMessage("⚠ Email address already exists. Please use a different email.");
        setErrors({ email: "This email is already registered" });
      } else if (backendMessage.toLowerCase().includes("number")) {
        setMessage("⚠ Mobile number already exists. Please use a different number.");
        setErrors({ mobileNumber: "This mobile number is already registered" });
      } else {
        setMessage(`❌ Failed: ${backendMessage}`);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error("CREATE USER ERROR:", error);

      let errorMessage = "Failed to create account";
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Connection timeout. Please try again.";
      } else if (error.response?.status === 409) {
        errorMessage = "User already exists with this information";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection";
      }

      setMessage(`❌ ${errorMessage}`);
      setStep("Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Create Your Account</h2>
        <p>Fill in your details to get started</p>
      </div>

      <form onSubmit={handleSubmitAction} className="login-form">
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <div className="input-wrapper">
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isLoading}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
              required
            />
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isLoading}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email address"
              required
            />
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="mobile">Mobile Number</label>
          <div className="input-wrapper">
            <input
              id="mobile"
              type="text"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              disabled={isLoading}
              maxLength="10"
              className={errors.mobileNumber ? 'error' : ''}
              placeholder="Enter 10-digit mobile number"
              required
            />
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>
          </div>
          {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
        </div>

        {isLoading && (
          <div className="loading-section">
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">{progress}%</div>
            </div>
            <div className="step-text">{step}</div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Creating Account...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Create Account
            </>
          )}
        </button>
      </form>

      {message && (
        <div className={`message ${message.startsWith('✅') ? 'success' : message.startsWith('⚠') ? 'warning' : 'error'}`}>
          {message}
        </div>
      )}

      {/* More Options Section */}
      <div className="more-options-section">
        <button
          className="more-options-toggle"
          onClick={() => setShowMoreOptions(!showMoreOptions)}
        >
          {showMoreOptions ? '▼' : '▶'} More Options
        </button>

        {showMoreOptions && (
          <div className="more-options-content">
            <div className="option-item" onClick={() => navigate('/fix-my-speaker')}>
              <div className="option-icon">🔊</div>
              <div className="option-details">
                <h4>Fix My Speaker</h4>
                <p>Audio-based speaker repair tool</p>
              </div>
            </div>

            <div className="option-item" onClick={() => navigate('/AdminLoginPage')}>
              <div className="option-icon">👮</div>
              <div className="option-details">
                <h4>Admin Login</h4>
                <p>Access admin dashboard</p>
              </div>
            </div>

            <div className="option-item" onClick={() => navigate('/Helpall')}>
              <div className="option-icon">❓</div>
              <div className="option-details">
                <h4>Help & Support</h4>
                <p>Get assistance and FAQ</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
