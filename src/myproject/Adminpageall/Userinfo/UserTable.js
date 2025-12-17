import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";

// ✅ single source of truth
const USERS_API = `${API_BASE_URL}/api/users`;

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "", // success | error | confirm
    confirmAction: null,
  });

  const [form, setForm] = useState({
    username: "",
    useremail: "",
    number: "",
  });

  // ================= FETCH USERS =================
  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${USERS_API}/all`);
      setUsers(res.data || []);
    } catch (error) {
      showPopup("Failed to load users!", "error");
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // ================= POPUP =================
  const showPopup = (message, type, confirmAction = null) => {
    setPopup({ show: true, message, type, confirmAction });
  };

  const closePopup = () => {
    setPopup({ show: false, message: "", type: "", confirmAction: null });
  };

  // ================= DELETE =================
  const deleteUser = (number) => {
    showPopup(
      "Are you sure you want to delete this user?",
      "confirm",
      async () => {
        try {
          setLoading(true);
          await axios.delete(`${USERS_API}/delete/${number}`);
          fetchAllUsers();
          showPopup("User deleted successfully!", "success");
        } catch {
          showPopup("Delete failed!", "error");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  // ================= EDIT =================
  const startEdit = (user) => {
    setEditUserId(user.id);
    setForm({
      username: user.username || "",
      useremail: user.useremail || "",
      number: user.number || "",
    });
  };

  // ================= UPDATE =================
  const updateUser = async () => {
    if (loading) return;

    if (!/^\d{10}$/.test(form.number)) {
      showPopup("Mobile number must be 10 digits", "error");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${USERS_API}/update/${form.number}`, form);
      setEditUserId(null);
      fetchAllUsers();
      showPopup("User updated successfully!", "success");
    } catch {
      showPopup("Update failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* ================= CSS ================= */}
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
        .table-wrapper { overflow-x: auto; }
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
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }
        tr:hover { background: #f5f7fa; }
        input {
          padding: 6px;
          border: 1px solid #bbb;
          border-radius: 6px;
          width: 120px;
        }
        button {
          padding: 7px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          color: white;
          font-weight: 500;
          margin-right: 6px;
        }
        .edit { background: #3498db; }
        .delete { background: #e74c3c; }
        .save { background: #2ecc71; }
        .cancel { background: #7f8c8d; }

        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
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
        }
        .btns { display: flex; justify-content: center; gap: 20px; margin-top: 15px; }
      `}</style>

      {/* ================= TABLE ================= */}
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

                {editUserId === u.id ? (
                  <>
                    <td>
                      <input
                        value={form.username}
                        onChange={(e) =>
                          setForm({ ...form, username: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={form.useremail}
                        onChange={(e) =>
                          setForm({ ...form, useremail: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={form.number}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            number: e.target.value.replace(/\D/g, "").slice(0, 10),
                          })
                        }
                      />
                    </td>
                    <td>{u.customerId}</td>
                    <td>
                      <button className="save" onClick={updateUser}>
                        Save
                      </button>
                      <button
                        className="cancel"
                        onClick={() => setEditUserId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.username}</td>
                    <td>{u.useremail}</td>
                    <td>{u.number}</td>
                    <td>{u.customerId}</td>
                    <td>
                      <button className="edit" onClick={() => startEdit(u)}>
                        Edit
                      </button>
                      <button
                        className="delete"
                        onClick={() => deleteUser(u.number)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= POPUP ================= */}
      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>{popup.message}</p>

            {popup.type === "confirm" ? (
              <div className="btns">
                <button
                  className="save"
                  onClick={() => {
                    popup.confirmAction();
                    closePopup();
                  }}
                >
                  Yes
                </button>
                <button className="delete" onClick={closePopup}>
                  No
                </button>
              </div>
            ) : (
              <button className="edit" onClick={closePopup}>
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
