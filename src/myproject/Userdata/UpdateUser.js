import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UpdateUser.css";
import { getUserByNumber, updateUser } from "../../api/user/userApi";

function UpdateUser() {
  const location = useLocation();
  const navigate = useNavigate();

  // Try to get number from state or local storage as fallback
  const number = location.state?.number || localStorage.getItem("userNumber");

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

  useEffect(() => {
    if (!number) {
      setMessage("⚠ User reference missing. Redirecting...");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    }
  }, [number, navigate]);

  useEffect(() => {
    if (!number) return;

    const fetchUser = async () => {
      setFetchLoading(true);
      setStep("Fetching profile...");
      try {
        const res = await getUserByNumber(number);
        const data = res.data?.data;
        if (data) {
          setForm({
            username: data.username || "",
            useremail: data.useremail || "",
            customerId: data.customerId || "",
            number: data.number || "",
          });
          setStep("Profile loaded");
        } else {
          setMessage("❌ Account not found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage("❌ Failed to load user data");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchUser();
  }, [number]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = "Name is required";
    if (!form.useremail) newErrors.useremail = "Email is required";
    if (!form.number) newErrors.number = "Number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setStep("Saving changes...");
    try {
      const res = await updateUser(number, form);
      if (res.data.status) {
        setMessage("✅ Updated successfully!");
        setTimeout(() => navigate("/LoginEdit", { state: res.data.data }), 1500);
      } else {
        setMessage("❌ Update failed: " + res.data.message);
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("❌ Communication error with server");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="update-container"><div className="loading-spinner"></div><p>{step}</p></div>;

  return (
    <div className="update-container-premium">
      <div className="update-glass-card">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>Edit Profile Information</h2>
        <p className="subtitle">ID: {form.customerId}</p>

        <form onSubmit={handleUpdate}>
          <div className="input-field">
            <label>Full Name</label>
            <input
              name="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Your Name"
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>

          <div className="input-field">
            <label>Email Address</label>
            <input
              name="useremail"
              value={form.useremail}
              onChange={(e) => setForm({ ...form, useremail: e.target.value })}
              placeholder="email@example.com"
            />
            {errors.useremail && <span className="error">{errors.useremail}</span>}
          </div>

          <div className="input-field">
            <label>Mobile Number</label>
            <input
              name="number"
              value={form.number}
              disabled
              title="Mobile number cannot be changed"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Updating..." : "Save Changes ✨"}
          </button>
        </form>

        {message && <div className={`message-banner ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}
      </div>
    </div>
  );
}

export default UpdateUser;
