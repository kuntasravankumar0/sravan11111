import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GoogleInfoModal.css";
import { syncGoogleUser } from "../../api/auth/authApi";

function GoogleInfoModal({ show, onClose, googleUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const navigate = useNavigate();

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
    return interval;
  };

  const handleAutoSaveGoogleInfoAction = async () => {
    if (!googleUser) return;

    setIsLoading(true);
    setStep("Validating Google account...");
    const progressInterval = simulateProgress();

    try {
      setStep("Connecting to server...");

      const response = await syncGoogleUser({
        googleId: googleUser.googleId,
        name: googleUser.name,
        email: googleUser.email,
        emailVerified: googleUser.emailVerified,
        picture: googleUser.picture,
        locale: googleUser.locale || "",
        authProvider: googleUser.authProvider
      });

      clearInterval(progressInterval);
      setProgress(100);
      setStep("Account saved successfully!");

      if (response.status === 200 || response.status === 201) {
        // Auto-navigate to LoginEdit after successful save
        setTimeout(() => {
          onClose();
          navigate("/LoginEdit", { state: googleUser });
        }, 2000);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error("Error saving Google info:", error);

      let errorMessage = "Failed to save Google account";
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Connection timeout. Please try again.";
      } else if (error.response?.status === 409) {
        errorMessage = "Google account already exists";
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

  // Auto-save when modal opens with Google user data
  useEffect(() => {
    if (show && googleUser) {
      handleAutoSaveGoogleInfoAction();
    }
  }, [show, googleUser]);

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !isLoading && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="header-content">
            <div className="google-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <h3>Google Account Integration</h3>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {googleUser && (
            <div className="google-info-display">
              <div className="profile-section">
                <div className="profile-image-container">
                  {googleUser.picture ? (
                    <>
                      <img
                        src={googleUser.picture}
                        alt="Profile"
                        className="profile-picture"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentNode.querySelector('.profile-placeholder');
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="profile-placeholder" style={{ display: 'none' }}>
                        <span>{googleUser.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="profile-placeholder" style={{ display: 'flex' }}>
                      <span>{googleUser.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    </div>
                  )}
                </div>
                <div className="profile-details">
                  <div className="detail-item">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{googleUser.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{googleUser.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Verified</span>
                    <span className={`detail-value ${googleUser.emailVerified ? 'verified' : 'unverified'}`}>
                      {googleUser.emailVerified ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                          Verified
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          Not Verified
                        </>
                      )}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Provider</span>
                    <span className="detail-value provider">{googleUser.authProvider}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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

          {message && (
            <div className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="close-btn-footer"
            onClick={onClose}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoogleInfoModal;