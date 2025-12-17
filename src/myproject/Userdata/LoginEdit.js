import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginEdit.css";
import API_BASE_URL from "../config/apiConfig";

// single endpoint source
const USERS_API = `${API_BASE_URL}/api/users`;

function LoginEdit() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const number = location.state?.number;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [popup, setPopup] = useState({
    update: false,
    delete: false,
    logout: false,
  });

  // 🚫 block direct access
  useEffect(() => {
    if (!location.state) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  // 📡 fetch user
  useEffect(() => {
    if (!number) return;

    let isMounted = true;
    setLoading(true);

    axios
      .get(`${USERS_API}/getbynumber/${number}`)
      .then((res) => {
        if (isMounted) {
          setUser(res.data?.data || null);
        }
      })
      .catch(() => {
        setMessage("❌ User not found");
        navigate("/", { replace: true });
      })
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, [number, navigate]);

  const handleDelete = async () => {
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      await axios.delete(`${USERS_API}/delete/${number}`);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("DELETE ERROR:", err?.message);
      setMessage("❌ Failed to delete user");
    } finally {
      setLoading(false);
      setPopup({ delete: false });
    }
  };

  const handleUpdate = () => {
    navigate("/UpdateUser", { state: { number } });
  };

  if (!location.state) return null;

  return (
    <div className="edit-container">
      <h2>Welcome User</h2>

      {loading && <p className="msg warn">Loading...</p>}

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

      <button
        className="btn update"
        onClick={() => setPopup({ update: true })}
        disabled={loading}
      >
        Update User
      </button>

      <button
        className="btn delete"
        onClick={() => setPopup({ delete: true })}
        disabled={loading}
      >
        Delete User
      </button>

      <button
        className="btn logout"
        onClick={() => setPopup({ logout: true })}
        disabled={loading}
      >
        Logout
      </button>

        <a href="/dashboard" className="more-option-card">
          <div className="icon-circle">🆓</div>
          <div className="option-text">
            <h3>user purpose </h3>
            <p>user can use </p>
          </div>
        </a>

      {/* POPUPS */}
      {popup.update && (
        <Popup
          title="Update User?"
          message="Do you want to update this user's information?"
          onCancel={() => setPopup({ update: false })}
          onConfirm={handleUpdate}
        />
      )}

      {popup.delete && (
        <Popup
          title="Delete User?"
          message="Are you sure? This cannot be undone."
          onCancel={() => setPopup({ delete: false })}
          onConfirm={handleDelete}
        />
      )}

      {popup.logout && (
        <Popup
          title="Logout?"
          message="Do you want to logout?"
          onCancel={() => setPopup({ logout: false })}
          onConfirm={() => navigate("/", { replace: true })}
        />
      )}
    </div>
  );
}

function Popup({ title, message, onCancel, onConfirm }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="popup-buttons">
          <button className="cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="ok" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginEdit;
