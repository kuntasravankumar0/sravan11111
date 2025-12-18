import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginEdit.css";
import API_BASE_URL from "../config/apiConfig";
import Login from "./Login";

const USERS_API = `${API_BASE_URL}/api/users`;

function LoginEdit() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const number = location.state?.number;

  const isGoogleUser = location.state?.authProvider === "GOOGLE";
  const googleUser = isGoogleUser ? location.state : null;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [popup, setPopup] = useState({
    update: false,
    delete: false,
    logout: false,
    custom: false,
  });

  // 🚫 block direct access
  useEffect(() => {
    if (!location.state) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  // ✅ store Google user details (optional, your existing logic)
  useEffect(() => {
    if (isGoogleUser && googleUser) {
      localStorage.setItem(
        "googleUser",
        JSON.stringify({
          name: googleUser.name,
          email: googleUser.email,
          picture: googleUser.picture,
          emailVerified: googleUser.emailVerified,
          locale: googleUser.locale,
          authProvider: "GOOGLE",
        })
      );
    }
  }, [isGoogleUser, googleUser]);

  // 📡 fetch normal user by number
  useEffect(() => {
    if (!number) return;

    let alive = true;
    setLoading(true);

    axios
      .get(`${USERS_API}/getbynumber/${number}`)
      .then((res) => {
        if (alive) setUser(res.data?.data || null);
      })
      .catch(() => {
        setMessage("❌ User not found");
        navigate("/", { replace: true });
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [number, navigate]);

  // ✅ FINAL SOURCE OF TRUTH → HEADER DATA
  useEffect(() => {
    // Google user → header
    if (isGoogleUser && googleUser) {
      localStorage.setItem(
        "headerUser",
        JSON.stringify({
          name: googleUser.name,
          email: googleUser.email,
          image: googleUser.picture || null,
        })
      );
      return;
    }

    // Normal user → header (after backend fetch)
    if (user && email) {
      localStorage.setItem(
        "headerUser",
        JSON.stringify({
          name: user.username,
          email: email,
          image: null,
        })
      );
    }
  }, [isGoogleUser, googleUser, user, email]);

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await axios.delete(`${USERS_API}/delete/${number}`);
      localStorage.removeItem("googleUser");
      localStorage.removeItem("headerUser");
      navigate("/", { replace: true });
    } catch {
      setMessage("❌ Failed to delete user");
    } finally {
      setLoading(false);
      setPopup({ ...popup, delete: false });
    }
  };

  const handleUpdate = () => {
    navigate("/UpdateUser", { state: { number } });
  };

  const handleLogout = () => {
    localStorage.removeItem("googleUser");
    localStorage.removeItem("headerUser");
    navigate("/", { replace: true });
  };

  if (!location.state) return null;

  return (
    <div className="edit-container">
      <h2>Welcome User</h2>

      {loading && <p className="msg warn">Loading...</p>}

      {isGoogleUser && (
        <div className="google-card">
          {googleUser.picture && (
            <img
              src={googleUser.picture}
              alt="Profile"
              className="google-avatar"
            />
          )}
          <p><strong>Name:</strong> {googleUser.name}</p>
          <p><strong>Email:</strong> {googleUser.email}</p>
          <p>
            <strong>Email Verified:</strong>{" "}
            {googleUser.emailVerified ? "Yes" : "No"}
          </p>
          {googleUser.locale && (
            <p><strong>Locale:</strong> {googleUser.locale}</p>
          )}
          <p className="google-badge">Signed in with Google</p>
        </div>
      )}

      <div className="info-box">
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Mobile Number:</strong> {number}</p>

        {user && (
          <>
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Customer ID:</strong> {user.customerId}</p>
          </>
        )}
      </div>

      {message && <p className="msg error">{message}</p>}
      
    <button onClick={() => navigate("/dashboard")}>Dashboard </button>
    
      <button className="btn" onClick={() => setPopup({ ...popup, custom: true })}>
        Open Popup
      </button>

      <button className="btn update" onClick={() => setPopup({ ...popup, update: true })}>
        Update User
      </button>

      <button className="btn delete" onClick={() => setPopup({ ...popup, delete: true })}>
        Delete User
      </button>

      <button className="btn logout" onClick={() => setPopup({ ...popup, logout: true })}>
        Logout
      </button>

      {popup.custom && (
        <ContentPopup
          title="User Registration"
          onClose={() => setPopup({ ...popup, custom: false })}
        >
          <Login />
        </ContentPopup>
      )}

      {popup.update && (
        <ConfirmPopup
          title="Update User?"
          message="Do you want to update this user's information?"
          onCancel={() => setPopup({ ...popup, update: false })}
          onConfirm={handleUpdate}
        />
      )}

      {popup.delete && (
        <ConfirmPopup
          title="Delete User?"
          message="Are you sure? This cannot be undone."
          onCancel={() => setPopup({ ...popup, delete: false })}
          onConfirm={handleDelete}
        />
      )}

      {popup.logout && (
        <ConfirmPopup
          title="Logout?"
          message="Do you want to logout?"
          onCancel={() => setPopup({ ...popup, logout: false })}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}

/* ================= POPUPS ================= */

function ConfirmPopup({ title, message, onCancel, onConfirm }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="popup-buttons">
          <button className="cancel" onClick={onCancel}>Cancel</button>
          <button className="ok" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
}

function ContentPopup({ title, children, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>{title}</h3>
        <div className="popup-content">{children}</div>
        <div className="popup-buttons">
          <button className="cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default LoginEdit;
