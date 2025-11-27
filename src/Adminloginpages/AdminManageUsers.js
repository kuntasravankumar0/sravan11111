import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateUserPopup from "./UpdateUserPopup";

function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  // Load all users
  const loadUsers = async () => {
    const res = await axios.get("https://besravan11111.onrender.com/api/Adminaprovel/all");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Delete user by customerId
  const deleteUser = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    await axios.delete(
      `https://besravan11111.onrender.com/api/Adminaprovel/delete/${customerId}`
    );
    alert("User deleted!");
    loadUsers();
  };

  // Approve user
  const approveUser = async (id) => {
    await axios.put(
      `https://besravan11111.onrender.com/api/Adminaprovel/approve/${id}`
    );
    alert("User Approved!");
    loadUsers();
  };

  // Reject user
  const rejectUser = async (id) => {
    await axios.put(
      `https://besravan11111.onrender.com/api/Adminaprovel/reject/${id}`
    );
    alert("User Rejected!");
    loadUsers();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin User Management</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHead}>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Customer ID</th>
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
                <td>{u.status}</td>

                <td>
                  <button
                    onClick={() => approveUser(u.id)}
                    style={styles.approveBtn}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectUser(u.id)}
                    style={styles.rejectBtn}
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => setEditUser(u)}
                    style={styles.editBtn}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteUser(u.customerId)}
                    style={styles.deleteBtn}
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
    borderRadius: "12px",
  },
  tableHead: {
    background: "#243447",
    color: "white",
    textAlign: "left",
  },
  row: {
    background: "#fff",
    borderBottom: "1px solid #ddd",
  },
  approveBtn: {
    padding: "6px 12px",
    marginRight: "8px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  rejectBtn: {
    padding: "6px 12px",
    marginRight: "8px",
    backgroundColor: "#ff9800",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  editBtn: {
    padding: "6px 12px",
    marginRight: "8px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "6px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AdminManageUsers;
