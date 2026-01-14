import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./UserTable.css";
import { getAllUsers, deleteUser as deleteUserService, updateUser as updateUserService, createUser as createUserService } from "../../../api/user/userApi";
import { syncGoogleUser, getAllGoogleUsers, deleteGoogleUser } from "../../../api/auth/authApi";
import { getOnlineUsers } from "../../../api/device/deviceApi";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [googleUsers, setGoogleUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("regular");
  const [editUserId, setEditUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const [form, setForm] = useState({
    username: "",
    useremail: "",
    name: "",
    email: "",
    number: "",
    status: "OFFLINE",
    authProvider: "MANUAL",
    latitude: 0,
    longitude: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const stats = useMemo(() => ({
    regular: Array.isArray(users) ? users.length : 0,
    google: Array.isArray(googleUsers) ? googleUsers.length : 0,
    total: (Array.isArray(users) ? users.length : 0) + (Array.isArray(googleUsers) ? googleUsers.length : 0),
    online: Array.isArray(onlineUsers) ? onlineUsers.length : 0
  }), [users, googleUsers, onlineUsers]);

  const filteredUsers = useMemo(() => {
    let items = activeTab === "regular" ? (Array.isArray(users) ? users : []) : (Array.isArray(googleUsers) ? googleUsers : []);

    if (showOnlineOnly) {
      items = items.filter(u => u && u.status === 'ONLINE');
    }

    let filtered = items.filter(u => {
      if (!u) return false;
      const name = (u.username || u.name || "").toLowerCase();
      const email = (u.useremail || u.email || "").toLowerCase();
      const numOrId = (u.number || u.googleId || "").toString();
      const term = (searchTerm || "").toLowerCase();
      return name.includes(term) || email.includes(term) || numOrId.includes(term);
    });
    return filtered;
  }, [users, googleUsers, activeTab, searchTerm, showOnlineOnly]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [regularRes, googleRes, onlineRes] = await Promise.all([
        getAllUsers().catch(() => ({ data: [] })),
        getAllGoogleUsers().catch(() => ({ data: { data: [] } })),
        getOnlineUsers().catch(() => ({ data: { data: [] } }))
      ]);

      setUsers(Array.isArray(regularRes.data) ? regularRes.data : []);

      const gData = googleRes.data?.data || googleRes.data;
      setGoogleUsers(Array.isArray(gData) ? gData : []);

      const oData = onlineRes.data?.data || onlineRes.data;
      setOnlineUsers(Array.isArray(oData) ? oData : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 15000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const handleDeleteUser = async (u) => {
    const isGoogle = !!u.googleId;
    const identifier = isGoogle ? u.googleId : u.number;

    if (!window.confirm(`Delete ${isGoogle ? 'Google' : 'Regular'} user ${identifier}?`)) return;

    setLoading(true);
    try {
      if (isGoogle) await deleteGoogleUser(identifier);
      else await deleteUserService(identifier);
      await fetchAllData();
      alert("User deleted successfully.");
    } catch (err) {
      alert("Failed to delete user: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (u) => {
    setEditUserId(u.id || u.googleId || u.number);
    setForm({
      ...u,
      username: u.username || "",
      useremail: u.useremail || "",
      name: u.name || "",
      email: u.email || "",
      number: u.number || "",
      status: u.status || "OFFLINE"
    });
  };

  const saveUserAction = async () => {
    setLoading(true);
    try {
      if (activeTab === "regular") {
        await updateUserService(form.number, form);
      } else {
        await syncGoogleUser({
          ...form,
          googleId: form.googleId,
          name: form.name,
          email: form.email
        });
      }
      setEditUserId(null);
      await fetchAllData();
      alert("Record updated successfully!");
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManualUser = async () => {
    if (!form.username || !form.number) {
      alert("Name and Number are required.");
      return;
    }
    setLoading(true);
    try {
      await createUserService({
        username: form.username,
        useremail: form.useremail || (form.username.toLowerCase() + "@example.com"),
        number: form.number,
        password: "DefaultPassword123!",
        authProvider: "MANUAL",
        status: "OFFLINE"
      });
      setShowAddForm(false);
      await fetchAllData();
      alert("Manual user created successfully!");
    } catch (err) {
      alert("Creation failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const formatLocation = (lat, lng) => {
    if (lat === null || lng === null || lat === undefined || lng === undefined) return "Unknown";
    return `📍 ${parseFloat(lat).toFixed(3)}, ${parseFloat(lng).toFixed(3)}`;
  };

  return (
    <div className="user-management-premium">
      <div className="um-header">
        <div className="um-title">
          <h1>Identity Control Center 🛡️</h1>
          <p>Global oversight of Manual and Google authenticated accounts.</p>
        </div>
        <div className="um-stats">
          <div className="um-stat-item">
            <span className="count">{stats.total}</span>
            <span className="label">Accounts</span>
          </div>
          <div className="um-stat-divider"></div>
          <div className="um-stat-item online">
            <span className="count">⚡ {stats.online}</span>
            <span className="label">Live Pulse</span>
          </div>
        </div>
      </div>

      <div className="um-controls">
        <div className="tab-group-container">
          <div className="tab-group">
            <button
              className={`tab-btn ${activeTab === "regular" ? "active" : ""}`}
              onClick={() => { setActiveTab("regular"); setEditUserId(null); }}
            >
              Manual Core
            </button>
            <button
              className={`tab-btn ${activeTab === "google" ? "active" : ""}`}
              onClick={() => { setActiveTab("google"); setEditUserId(null); }}
            >
              Google OAuth
            </button>
          </div>

          <button
            className="um-add-btn"
            onClick={() => {
              setForm({ username: "", number: "", useremail: "", status: "OFFLINE" });
              setShowAddForm(true);
            }}
          >
            ➕ Add Manual User
          </button>
        </div>

        <div className="um-filters">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={() => setShowOnlineOnly(!showOnlineOnly)}
            />
            <span className="slider round"></span>
            <span className="toggle-label">Active Only</span>
          </label>

          <div className="search-wrap">
            <input
              type="text"
              placeholder="Filter by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="um-add-overlay">
          <div className="um-add-modal">
            <h3>Register Manual Account</h3>
            <div className="um-form-row">
              <input
                placeholder="Full Name"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
              />
              <input
                placeholder="Mobile Number"
                value={form.number}
                onChange={e => setForm({ ...form, number: e.target.value })}
              />
            </div>
            <input
              placeholder="Email Address (Optional)"
              value={form.useremail}
              onChange={e => setForm({ ...form, useremail: e.target.value })}
            />
            <div className="um-modal-actions">
              <button onClick={handleCreateManualUser} className="um-btn save">Create User</button>
              <button onClick={() => setShowAddForm(false)} className="um-btn cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="um-table-container">
        {loading && <div className="um-loading-overlay">Syncing with server...</div>}
        <table className="um-table">
          <thead>
            {activeTab === "regular" ? (
              <tr>
                <th>Profile</th>
                <th>Identity</th>
                <th>Mobile</th>
                <th>Geo-Location</th>
                <th>Presence</th>
                <th>Management</th>
              </tr>
            ) : (
              <tr>
                <th>Identity</th>
                <th>OAuth Name</th>
                <th>OAuth Email</th>
                <th>Geo-Location</th>
                <th>Presence</th>
                <th>Management</th>
              </tr>
            )}
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="um-empty-td">
                  <div className="um-empty-state">
                    <span>📭</span>
                    <p>No users match your current filter or selected tab.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => {
                const rowId = u.id || u.googleId || u.number;
                const isEditing = editUserId === rowId;
                return (
                  <tr key={rowId} className={isEditing ? "editing-row" : ""}>
                    {activeTab === "regular" ? (
                      <>
                        <td><div className="um-avatar-mini">{u.username?.charAt(0)}</div></td>
                        <td>
                          <div className="um-name-field">
                            {isEditing ? (
                              <>
                                <input
                                  value={form.username}
                                  onChange={e => setForm({ ...form, username: e.target.value })}
                                  className="um-edit-input"
                                />
                                <input
                                  value={form.useremail}
                                  onChange={e => setForm({ ...form, useremail: e.target.value })}
                                  className="um-edit-input"
                                />
                              </>
                            ) : (
                              <>
                                <span className="name">{u.username}</span>
                                <span className="email">{u.useremail}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td><span className="um-value">{u.number}</span></td>
                        <td><span className="um-location-chip">{formatLocation(u.latitude, u.longitude)}</span></td>
                        <td>
                          {isEditing ? (
                            <select
                              value={form.status}
                              onChange={e => setForm({ ...form, status: e.target.value })}
                              className="um-edit-select"
                            >
                              <option value="ONLINE">ONLINE</option>
                              <option value="OFFLINE">OFFLINE</option>
                            </select>
                          ) : (
                            <div className={`um-status-badge ${u.status === 'ONLINE' ? 'online' : 'offline'}`}>
                              {u.status}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="um-actions">
                            {isEditing ? (
                              <>
                                <button onClick={saveUserAction} className="um-btn save">Save</button>
                                <button onClick={() => setEditUserId(null)} className="um-btn cancel">X</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => startEdit(u)} className="um-btn edit" title="Edit User">✏️</button>
                                <button onClick={() => handleDeleteUser(u)} className="um-btn delete" title="Delete User">🗑️</button>
                              </>
                            )}
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <img
                            src={u.picture || 'https://via.placeholder.com/40'}
                            alt=""
                            className="um-avatar-img"
                            onError={(e) => e.target.src = "https://img.icons8.com/bubbles/100/000000/user.png"}
                          />
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              value={form.name}
                              onChange={e => setForm({ ...form, name: e.target.value })}
                              className="um-edit-input"
                            />
                          ) : (
                            <span className="name">{u.name}</span>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              value={form.email}
                              onChange={e => setForm({ ...form, email: e.target.value })}
                              className="um-edit-input"
                            />
                          ) : (
                            <span className="email">{u.email}</span>
                          )}
                        </td>
                        <td><span className="um-location-chip">{formatLocation(u.latitude, u.longitude)}</span></td>
                        <td>
                          {isEditing ? (
                            <select
                              value={form.status}
                              onChange={e => setForm({ ...form, status: e.target.value })}
                              className="um-edit-select"
                            >
                              <option value="ONLINE">ONLINE</option>
                              <option value="OFFLINE">OFFLINE</option>
                            </select>
                          ) : (
                            <div className={`um-status-badge ${u.status === 'ONLINE' ? 'online' : 'offline'}`}>
                              {u.status}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="um-actions">
                            {isEditing ? (
                              <>
                                <button onClick={saveUserAction} className="um-btn save">Save</button>
                                <button onClick={() => setEditUserId(null)} className="um-btn cancel">X</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => startEdit(u)} className="um-btn edit" title="Edit User">✏️</button>
                                <button onClick={() => handleDeleteUser(u)} className="um-btn delete" title="Delete User">🗑️</button>
                              </>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
