import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";

// ✅ single source of truth
const ADMIN_API = `${API_BASE_URL}/api/Adminaprovel`;

function AdminGetAllData() {
  const [pendingUsers, setPending] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ---------- LOAD PENDING ----------
  const loadPending = async () => {
    try {
      const res = await axios.get(`${ADMIN_API}/pending`);
      setPending(res.data || []);
    } catch (err) {
      console.error("LOAD PENDING ERROR:", err?.message);
      setMessage("❌ Failed to load pending users");
    }
  };

  // ---------- LOAD ALL ----------
  const loadAll = async () => {
    try {
      const res = await axios.get(`${ADMIN_API}/all`);
      setAllUsers(res.data || []);
    } catch (err) {
      console.error("LOAD ALL ERROR:", err?.message);
      setMessage("❌ Failed to load admins");
    }
  };

  useEffect(() => {
    loadPending();
    loadAll();
  }, []);

  // ---------- APPROVE ----------
  const approveUser = async (id) => {
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      await axios.put(`${ADMIN_API}/approve/${id}`);
      setMessage("✅ User approved successfully");
      loadPending();
      loadAll();
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
      loadPending();
      loadAll();
    } catch (err) {
      console.error("REJECT ERROR:", err?.message);
      setMessage("❌ Rejection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>Admin Approval Dashboard</h2>

      {message && (
        <p style={{ textAlign: "center", marginBottom: 15 }}>
          {message}
        </p>
      )}

      {/* ================= PENDING ================= */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>⏳ Pending Users</h3>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Admin Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Approve</th>
                <th style={styles.th}>Reject</th>
              </tr>
            </thead>

            <tbody>
              {pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, ...styles.noData }}>
                    No Pending Users
                  </td>
                </tr>
              ) : (
                pendingUsers.map((u, index) => (
                  <tr
                    key={u.id}
                    style={{
                      ...styles.row,
                      backgroundColor:
                        index % 2 === 0 ? "#ffffff" : "#f7f9fc",
                    }}
                  >
                    <td style={styles.td}>{u.id}</td>
                    <td style={styles.td}>{u.adminname}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.status}</td>

                    <td style={styles.td}>
                      <button
                        onClick={() => approveUser(u.id)}
                        style={styles.approveBtn}
                        disabled={loading}
                      >
                        Approve
                      </button>
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() => rejectUser(u.id)}
                        style={styles.rejectBtn}
                        disabled={loading}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ALL ADMINS ================= */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>📋 All Admins</h3>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Admin Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {allUsers.map((u, index) => (
                <tr
                  key={u.id}
                  style={{
                    ...styles.row,
                    backgroundColor:
                      index % 2 === 0 ? "#ffffff" : "#f7f9fc",
                  }}
                >
                  <td style={styles.td}>{u.id}</td>
                  <td style={styles.td}>{u.adminname}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    background: "#eef2f7",
    minHeight: "100vh",
  },
  pageTitle: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "30px",
    fontWeight: "bold",
    color: "#222",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "30px",
    boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
  },
  sectionTitle: {
    marginBottom: "15px",
    fontSize: "22px",
    fontWeight: "600",
    color: "#333",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },
  th: {
    padding: "10px 12px",
    background: "#243447",
    color: "#fff",
    fontSize: "14px",
  },
  td: {
    padding: "10px 12px",
    fontSize: "14px",
    borderBottom: "1px solid #e0e0e0",
  },
  row: {},
  noData: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
  },
  approveBtn: {
    padding: "8px 14px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  rejectBtn: {
    padding: "8px 14px",
    backgroundColor: "#ff9800",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default AdminGetAllData;
