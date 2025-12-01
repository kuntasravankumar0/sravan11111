import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminGetAllData() {
  const [pendingUsers, setPending] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const loadPending = async () => {
    const res = await axios.get("https://besravan11111.onrender.com/api/Adminaprovel/pending");
    setPending(res.data);
  };

  const loadAll = async () => {
    const res = await axios.get("https://besravan11111.onrender.com/api/Adminaprovel/all");
    setAllUsers(res.data);
  };

  useEffect(() => {
    loadPending();
    loadAll();
  }, []);

  const approveUser = async (id) => {
    await axios.put(`https://besravan11111.onrender/api/Adminaprovel/approve/${id}`);
    alert("User Approved!");
    loadPending();
    loadAll();
  };

  const rejectUser = async (id) => {
    await axios.put(`https://besravan11111.onrender/api/Adminaprovel/reject/${id}`);
    alert("User Rejected!");
    loadPending();
    loadAll();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>Admin Approval Dashboard</h2>

      {/* Pending Users Section */}
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
                        onMouseOver={(e) =>
                          (e.target.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.transform = "scale(1)")
                        }
                      >
                        Approve
                      </button>
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() => rejectUser(u.id)}
                        style={styles.rejectBtn}
                        onMouseOver={(e) =>
                          (e.target.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.transform = "scale(1)")
                        }
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

      {/* All Users Section */}
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

/* ============================
        ADVANCED STYLES 
============================ */

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
    transition: "0.3s",
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
    borderRadius: "10px",
    overflow: "hidden",
    background: "#fff",
  },

  th: {
    padding: "10px 12px",
    background: "#243447",
    color: "#fff",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: 600,
    borderBottom: "2px solid #1b2836",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "10px 12px",
    fontSize: "14px",
    color: "#333",
    borderBottom: "1px solid #e0e0e0",
  },

  row: {
    transition: "background 0.2s ease",
  },

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
    transition: "0.2s ease",
  },

  rejectBtn: {
    padding: "8px 14px",
    backgroundColor: "#ff9800",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s ease",
  },
};

export default AdminGetAllData;
