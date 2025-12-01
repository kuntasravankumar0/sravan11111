    import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateUser.css";

function UpdateUser() {
  const location = useLocation();
  const navigate = useNavigate();

  const number = location.state?.number;

  const [form, setForm] = useState({
    username: "",
    useremail: "",
    customerId: "",
    number: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Stop direct access
  useEffect(() => {
    if (!number) {
      navigate("/", { replace: true });
    }
  }, [number, navigate]);

  // Fetch user
  useEffect(() => {
    if (!number) return;

    axios
      .get(`https://besravan11111.onrender.com/api/users/getbynumber/${number}`)
      .then((res) => {
        const data = res.data.data;

        if (!data) {
          alert("User not found!");
          navigate("/");
          return;
        }

        setForm({
          username: data.username || "",
          useremail: data.useremail || "",
          customerId: data.customerId || "",
          number: data.number || ""
        });
      })
      .catch(() => alert("Failed to fetch user!"));
  }, [number, navigate]);

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "number") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (form.number.length !== 10) {
      setMessage("❌ Mobile number must be exactly 10 digits.");
      return;
    }

    setLoading(true);

    axios
      .put(`https://besravan11111.onrender.com/api/users/update/${number}`, form)
      .then(() => {
        setMessage("✅ User updated successfully!");

        setTimeout(() => {
          navigate("/LoginEdit", {
            state: {
              email: form.useremail,
              number: form.number
            }
          });
        }, 1200);
      })
      .catch(() => setMessage("❌ Failed to update user!"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="update-container">
      <h2>Update User</h2>

      <form onSubmit={handleUpdate} className="update-form">

        <label>Name</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="useremail"
          value={form.useremail}
          onChange={handleChange}
          required
        />

        <label>Mobile Number</label>
        <input
          type="text"
          name="number"
          value={form.number}
          maxLength="10"
          onChange={handleChange}
          required
        />

        <label>Customer ID</label>
        <input
          type="text"
          name="customerId"
          value={form.customerId}
          onChange={handleChange}
          required
        />

        <button disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>

      {message && <p className="msg">{message}</p>}
    </div>
  );
}

export default UpdateUser;
