import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateUser.css";
import API_BASE_URL from "../config/apiConfig";

// ✅ single source of endpoint
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

  // 🚫 block direct access
  useEffect(() => {
    if (!number) {
      navigate("/", { replace: true });
    }
  }, [number, navigate]);

  // 📡 fetch user safely
  useEffect(() => {
    if (!number) return;

    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${USERS_API}/getbynumber/${number}`
        );

        const data = res.data?.data;

        if (!data) {
          setMessage("❌ User not found");
          navigate("/", { replace: true });
          return;
        }

        if (isMounted) {
          setForm({
            username: data.username || "",
            useremail: data.useremail || "",
            customerId: data.customerId || "",
            number: data.number || "",
          });
        }
      } catch (err) {
        console.error("FETCH USER ERROR:", err?.message);
        setMessage("❌ Failed to fetch user");
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [number, navigate]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "number") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (form.number.length !== 10) {
      setMessage("❌ Mobile number must be exactly 10 digits");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.put(
        `${USERS_API}/update/${number}`,
        form
      );

      setMessage("✅ User updated successfully");

      setTimeout(() => {
        navigate("/LoginEdit", {
          state: {
            email: form.useremail,
            number: form.number,
          },
        });
      }, 1200);
    } catch (err) {
      console.error("UPDATE ERROR:", err?.message);
      setMessage("❌ Failed to update user");
    } finally {
      setLoading(false);
    }
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
