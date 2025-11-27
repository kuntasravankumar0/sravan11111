import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/users";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
    confirmAction: null,
  });

  const [form, setForm] = useState({
    username: "",
    useremail: "",
    number: "",
  });

  // =============== FETCH USERS =================
  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all`);
      setUsers(res.data);
    } catch (error) {
      showPopup("Failed to load users!", "error");
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // =============== POPUP HANDLERS ==============
  const showPopup = (message, type, confirmAction = null) => {
    setPopup({ show: true, message, type, confirmAction });
  };

  const closePopup = () => {
    setPopup({ show: false, message: "", type: "", confirmAction: null });
  };

  // =============== DELETE ======================
  const deleteUser = (number) => {
    showPopup("Are you sure you want to delete this user?", "confirm", () => {
      confirmDelete(number);
    });
  };

  const confirmDelete = async (number) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${number}`);
      fetchAllUsers();
      showPopup("User deleted successfully!", "success");
    } catch {
      showPopup("Delete failed!", "error");
    }
  };

  // =============== EDIT ========================
  const startEdit = (user) => {
    setEditUser(user.id);
    setForm({
      username: user.username,
      useremail: user.useremail,
      number: user.number,
    });
  };

  // =============== UPDATE ======================
  const updateUser = async () => {
    try {
      await axios.put(`${BASE_URL}/update/${form.number}`, form);
      setEditUser(null);
      fetchAllUsers();
      showPopup("User updated successfully!", "success");
    } catch {
      showPopup("Update failed!", "error");
    }
  };

  return (
    <div className="container">

      {/* ======== CLEAN CSS INSIDE COMPONENT ========= */}
      <style>{`
        .container {
          width: 90%;
          margin: 40px auto;
          font-family: Poppins, sans-serif;
        }

        .title {
          text-align: center;
          font-size: 32px;
          margin-bottom: 20px;
          color: #34495e;
          font-weight: 600;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 750px;
          border-collapse: collapse;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
        }

        th {
          background: #2c3e50;
          padding: 14px;
          color: #fff;
          font-weight: 500;
        }

        td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        tr:hover {
          background: #f5f7fa;
        }

        input {
          padding: 6px;
          border: 1px solid #bbb;
          border-radius: 6px;
          width: 120px;
        }

        .edit-btn, .delete-btn, .save-btn, .cancel-btn {
          padding: 7px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          color: white;
          font-weight: 500;
          transition: 0.2s ease;
        }

        .edit-btn { background: #3498db; }
        .edit-btn:hover { background: #2980b9; }

        .delete-btn { background: #e74c3c; }
        .delete-btn:hover { background: #c0392b; }

        .save-btn { background: #2ecc71; }
        .save-btn:hover { background: #27ae60; }

        .cancel-btn { background: #7f8c8d; }
        .cancel-btn:hover { background: #636e72; }

        /* Popup */
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .popup-box {
          width: 90%;
          max-width: 330px;
          padding: 25px;
          background: white;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 10px 22px rgba(0,0,0,0.25);
        }

        .btns {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 15px;
        }

        .yes-btn, .no-btn, .ok-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: white;
          font-weight: 500;
        }

        .yes-btn { background: #2ecc71; }
        .no-btn { background: #e74c3c; }
        .ok-btn { background: #3498db; }

        /* Responsive */
        @media (max-width: 600px) {
          .title { font-size: 26px; }
          td, th { font-size: 12px; padding: 10px; }
          input { width: 100%; }
        }
      `}</style>

      {/* ================= TABLE ================== */}
      <h1 className="title">User Management</h1>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Number</th>
              <th>Customer ID</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>

                {editUser === u.id ? (
                  <>
                    <td><input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></td>
                    <td><input value={form.useremail} onChange={(e) => setForm({ ...form, useremail: e.target.value })} /></td>
                    <td><input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} /></td>
                    <td>{u.customerId}</td>

                    <td>
                      <button className="save-btn" onClick={updateUser}>Save</button>
                      <button className="cancel-btn" onClick={() => setEditUser(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.username}</td>
                    <td>{u.useremail}</td>
                    <td>{u.number}</td>
                    <td>{u.customerId}</td>

                    <td>
                      <button className="edit-btn" onClick={() => startEdit(u)}>Edit</button>
                      <button className="delete-btn" onClick={() => deleteUser(u.number)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ================= POPUP ================== */}
      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>{popup.message}</p>

            {popup.type === "confirm" ? (
              <div className="btns">
                <button className="yes-btn" onClick={() => { popup.confirmAction(); closePopup(); }}>Yes</button>
                <button className="no-btn" onClick={closePopup}>No</button>
              </div>
            ) : (
              <button className="ok-btn" onClick={closePopup}>OK</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
