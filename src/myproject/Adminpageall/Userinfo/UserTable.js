import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";
import "./UserTable.css";

const USERS_API = `${API_BASE_URL}/api/users`;
const GOOGLE_INFO_API = `${API_BASE_URL}/api/googleinfo`;

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [googleUsers, setGoogleUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("regular");
  const [editUserId, setEditUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    username: "",
    useremail: "",
    number: "",
    status: "OFFLINE"
  });

  const stats = useMemo(() => ({
    regular: users.length,
    google: googleUsers.length,
    total: users.length + googleUsers.length
  }), [users, googleUsers]);

  const filteredUsers = useMemo(() => {
    let items = activeTab === "regular" ? users : googleUsers;
    let filtered = items.filter(u => {
      const name = (u.username || u.name || "").toLowerCase();
      const email = (u.useremail || u.email || "").toLowerCase();
      const num = (u.number || "").toString();
      const term = searchTerm.toLowerCase();
      return name.includes(term) || email.includes(term) || num.includes(term);
    });

    return filtered;
  }, [users, googleUsers, activeTab, searchTerm]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [regularRes, googleRes] = await Promise.all([
        axios.get(`${USERS_API}/all`),
        axios.get(GOOGLE_INFO_API)
      ]);
      setUsers(regularRes.data || []);
      setGoogleUsers(googleRes.data?.data || googleRes.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const deleteUser = async (number, isGoogle = false, googleId = null) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      if (isGoogle) await axios.delete(`${GOOGLE_INFO_API}/${googleId}`);
      else await axios.delete(`${USERS_API}/delete/${number}`);
      fetchAllData();
    } catch { alert("Delete failed"); }
  };

  const startEdit = (u) => {
    setEditUserId(u.id);
    setForm({
      username: u.username || "",
      useremail: u.useremail || "",
      number: u.number || "",
      status: u.status || "OFFLINE"
    });
  };

  const saveUser = async () => {
    try {
      await axios.put(`${USERS_API}/update/${form.number}`, form);
      setEditUserId(null);
      fetchAllData();
    } catch { alert("Update failed"); }
  };

  return (
    <div className="user-table-container">
      <div className="header" style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '800' }}>User Management</h1>
        <div className="stats-compact" style={{ display: 'flex', gap: '15px', fontSize: '13px' }}>
          <span><b>{stats.regular}</b> Users</span>
          <span><b>{stats.google}</b> Google</span>
          <span><b>{stats.total}</b> Total</span>
        </div>
      </div>

      <div className="controls-compact" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <div className="tabs" style={{ display: 'flex', background: '#eee', borderRadius: '8px', padding: '4px' }}>
          <button className={`tab-button ${activeTab === "regular" ? "active" : ""}`} onClick={() => setActiveTab("regular")} style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: activeTab === 'regular' ? 'white' : 'transparent', fontWeight: '600' }}>Regular</button>
          <button className={`tab-button ${activeTab === "google" ? "active" : ""}`} onClick={() => setActiveTab("google")} style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: activeTab === 'google' ? 'white' : 'transparent', fontWeight: '600' }}>Google</button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', width: '200px' }}
        />
      </div>

      <div className="table-card" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        {loading ? <div style={{ padding: '20px', textAlign: 'center' }}>Updating...</div> : (
          <table className="users-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9f9f9' }}>
              {activeTab === "regular" ? (
                <tr>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>ID</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Name</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Email</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Mobile</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Actions</th>
                </tr>
              ) : (
                <tr>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Pic</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Name</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Email</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Actions</th>
                </tr>
              )}
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  {activeTab === "regular" ? (
                    <>
                      <td style={{ padding: '12px 10px', color: '#888' }}>#{u.id}</td>
                      {editUserId === u.id ? (
                        <>
                          <td style={{ padding: '8px' }}><input size="10" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></td>
                          <td style={{ padding: '8px' }}><input size="15" value={form.useremail} onChange={e => setForm({ ...form, useremail: e.target.value })} /></td>
                          <td style={{ padding: '8px' }}>{u.number}</td>
                          <td style={{ padding: '8px' }}>
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                              <option value="ONLINE">ON</option>
                              <option value="OFFLINE">OFF</option>
                            </select>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <button onClick={saveUser}>✅</button>
                            <button onClick={() => setEditUserId(null)}>❌</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '12px 10px', fontWeight: '500' }}>{u.username}</td>
                          <td style={{ padding: '12px 10px' }}>{u.useremail}</td>
                          <td style={{ padding: '12px 10px' }}>{u.number}</td>
                          <td style={{ padding: '12px 10px' }}>
                            <span className={`status-badge ${u.status === 'ONLINE' ? 'status-online' : 'status-offline'}`} style={{ fontSize: '11px' }}>{u.status}</span>
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <button className="btn-icon" onClick={() => startEdit(u)}>✏️</button>
                            <button className="btn-icon" onClick={() => deleteUser(u.number)}>🗑️</button>
                          </td>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '10px' }}><img src={u.picture || 'https://via.placeholder.com/30'} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%' }} /></td>
                      <td style={{ padding: '10px', fontWeight: '500' }}>{u.name}</td>
                      <td style={{ padding: '10px' }}>{u.email}</td>
                      <td style={{ padding: '10px' }}><span className={`status-badge ${u.status === 'ONLINE' ? 'status-online' : 'status-offline'}`} style={{ fontSize: '11px' }}>{u.status}</span></td>
                      <td style={{ padding: '10px' }}>
                        <button className="btn-icon" onClick={() => deleteUser(null, true, u.googleId)}>🗑️</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
