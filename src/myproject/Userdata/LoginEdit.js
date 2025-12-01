import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginEdit.css"; // NEW CSS FILE

function LoginEdit() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [showPopup, setShowPopup] = useState({
    update: false,
    delete: false,
    logout: false,
  });

  const email = location.state?.email;
  const number = location.state?.number;

  // Stop direct access
  useEffect(() => {
    if (!location.state) navigate("/", { replace: true });
  }, [location.state, navigate]);

  // Fetch user
  useEffect(() => {
    if (!number) return;

    axios
      .get(`https://besravan11111.onrender.com/api/users/getbynumber/${number}`)
      .then((res) => setUser(res.data.data))
      .catch(() => alert("User not found"));
  }, [number]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://besravan11111.onrender.com/api/users/delete/${number}`
      );

      alert("User deleted");
      navigate("/");
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleUpdate = () => {
    navigate("/UpdateUser", { state: { number } });
  };

  if (!location.state) return null;

  return (
    <div className="edit-container">
      <h2>Welcome User</h2>

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

      <button className="btn update" onClick={() => setShowPopup({ update: true })}>
        Update User
      </button>

      <button className="btn delete" onClick={() => setShowPopup({ delete: true })}>
        Delete User
      </button>

      <button className="btn logout" onClick={() => setShowPopup({ logout: true })}>
        Logout
      </button>

      {/* POPUPS */}
      {showPopup.update && (
        <Popup
          title="Update User?"
          message="Do you want to update this user's information?"
          onCancel={() => setShowPopup({ update: false })}
          onConfirm={handleUpdate}
        />
      )}

      {showPopup.delete && (
        <Popup
          title="Delete User?"
          message="Are you sure? This cannot be undone."
          onCancel={() => setShowPopup({ delete: false })}
          onConfirm={handleDelete}
        />
      )}

      {showPopup.logout && (
        <Popup
          title="Logout?"
          message="Do you want to logout?"
          onCancel={() => setShowPopup({ logout: false })}
          onConfirm={() => navigate("/")}
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
          <button className="cancel" onClick={onCancel}>Cancel</button>
          <button className="ok" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
}

export default LoginEdit;
