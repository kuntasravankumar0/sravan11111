import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateUserPopup from "./UpdateUserPopup";
import API_BASE_URL from "../../config/apiConfig";

// ✅ single source of truth
const ADMIN_API = `${API_BASE_URL}/api/Adminaprovel`;

function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ---------- LOAD USERS ----------
  const loadUsers = async () => {
    try {
      const res = await axios.get(`${ADMIN_API}/all`);
      setUsers(res.data || []);
    } catch (err) {
      console.error("LOAD USERS ERROR:", err?.message);
      setMessage("❌ Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ---------- DELETE ----------
  const deleteUser = async (customerId) => {
    if (loading) return;

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    setMessage("");

    try {
      await axios.delete(`${ADMIN_API}/delete/${customerId}`);
      setMessage("✅ User deleted successfully");
      loadUsers();
    } catch (err) {
      console.error("DELETE ERROR:", err?.message);
      setMessage("❌ Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------- APPROVE ----------
  const approveUser = async (id) => {
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      await axios.put(`${ADMIN_API}/approve/${id}`);
      setMessage("✅ User approved");
      loadUsers();
    } catch (err) {
      console.error("APPROVE ERROR:", err?.message);
      setMessage("❌ Approval failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------- REJECT ----------
  const rejectUser = async (id) => {
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      await axios.put(`${ADMIN_API}/reject/${id}`);
      setMessage("⚠ User rejected");
      loadUsers();
    } catch (err) {
      console.error("REJECT ERROR:", err?.message);
      setMessage("❌ Rejection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin User Management</h2>

      {message && (
        <p style={{ marginBottom: 15 }}>
          {message}
        </p>
      )}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHead}>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Customer ID</th>
              <th>password</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={styles.row}>
                <td>{u.id}</td>
                <td>{u.adminname}</td>
                <td>{u.email}</td>
                <td>{u.customerId}</td>
                <td>{u.password}</td>
                <td>{u.status}</td>

                <td>
                  <button
                    onClick={() => approveUser(u.id)}
                    style={styles.approveBtn}
                    disabled={loading}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectUser(u.id)}
                    style={styles.rejectBtn}
                    disabled={loading}
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => setEditUser(u)}
                    style={styles.editBtn}
                    disabled={loading}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteUser(u.customerId)}
                    style={styles.deleteBtn}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUser && (
        <UpdateUserPopup
          user={editUser}
          closePopup={() => setEditUser(null)}
          refresh={loadUsers}
        />
      )}
    </div>
  );
}

const styles = {
  container: { padding: "30px" },
  title: { marginBottom: "20px" },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    borderRadius: "12px",
    boxShadow: "0px 0px 12px rgba(0,0,0,0.15)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },
  tableHead: {
    background: "#243447",
    color: "white",
  },
  row: {
    borderBottom: "1px solid #ddd",
  },
  approveBtn: {
    padding: "6px 12px",
    marginRight: "8px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  rejectBtn: {
    padding: "6px 12px",
    marginRight: "8px",
    backgroundColor: "#ff9800",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  editBtn: {
    padding: "6px 12px",
    marginRight: "8px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  deleteBtn: {
    padding: "6px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default AdminManageUsers;
