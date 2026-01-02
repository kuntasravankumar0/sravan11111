import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";
import "./AdminGetAllData.css";

const ADMIN_API = `${API_BASE_URL}/api/Adminaprovel`;

function AdminGetAllData() {
  const [pendingUsers, setPending] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [stats, setStats] = useState({
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalAll: 0
  });

  // Enhanced message display
  const showMessage = useCallback((msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  }, []);

  // Load pending users with enhanced error handling
  const loadPending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ADMIN_API}/pending`, { timeout: 10000 });
      const pendingData = res.data || [];
      setPending(pendingData);

      setStats(prev => ({ ...prev, totalPending: pendingData.length }));
    } catch (err) {
      console.error("LOAD PENDING ERROR:", err?.message);
      showMessage("❌ Failed to load pending users. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  // Load all users with enhanced error handling
  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ADMIN_API}/all`, { timeout: 10000 });
      const allData = res.data || [];
      setAllUsers(allData);

      // Calculate detailed stats
      const stats = allData.reduce((acc, user) => {
        acc.totalAll++;
        if (user.status === 'approved') acc.totalApproved++;
        else if (user.status === 'rejected') acc.totalRejected++;
        return acc;
      }, { totalAll: 0, totalApproved: 0, totalRejected: 0 });

      setStats(prev => ({ ...prev, ...stats }));
    } catch (err) {
      console.error("LOAD ALL ERROR:", err?.message);
      showMessage("❌ Failed to load all users. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    loadPending();
    loadAll();
  }, [loadPending, loadAll]);

  // Enhanced approve with better feedback
  const approveUser = useCallback(async (id) => {
    if (loading) return;

    setLoading(true);
    try {
      await axios.put(`${ADMIN_API}/approve/${id}`, {}, { timeout: 10000 });
      showMessage("✅ User approved successfully!", "success");
      await Promise.all([loadPending(), loadAll()]);
    } catch (err) {
      console.error("APPROVE ERROR:", err?.message);
      showMessage("❌ Failed to approve user. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [loading, showMessage, loadPending, loadAll]);

  // Enhanced reject with better feedback
  const rejectUser = useCallback(async (id) => {
    if (loading) return;

    if (!window.confirm("Are you sure you want to reject this user?")) return;

    setLoading(true);
    try {
      await axios.put(`${ADMIN_API}/reject/${id}`, {}, { timeout: 10000 });
      showMessage("⚠️ User rejected successfully!", "warning");
      await Promise.all([loadPending(), loadAll()]);
    } catch (err) {
      console.error("REJECT ERROR:", err?.message);
      showMessage("❌ Failed to reject user. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [loading, showMessage, loadPending, loadAll]);

  // Filtered data for current tab
  const filteredData = useMemo(() => {
    const data = activeTab === "pending" ? pendingUsers : allUsers;

    return data.filter(user => {
      const matchesSearch = !searchText ||
        user.adminname?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.id?.toString().includes(searchText);

      const matchesStatus = !statusFilter || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [activeTab, pendingUsers, allUsers, searchText, statusFilter]);

  const getStatusBadge = useCallback((status) => {
    const statusMap = {
      pending: { class: 'status-pending', icon: '⏳', text: 'Pending' },
      approved: { class: 'status-approved', icon: '✅', text: 'Approved' },
      rejected: { class: 'status-rejected', icon: '❌', text: 'Rejected' }
    };

    const statusInfo = statusMap[status] || { class: 'status-unknown', icon: '❓', text: status };

    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.icon} {statusInfo.text}
      </span>
    );
  }, []);

  const refreshData = useCallback(() => {
    loadPending();
    loadAll();
  }, [loadPending, loadAll]);

  return (
    <div className="admin-get-all-data">
      <div className="header">
        <h1>Admin Approval Dashboard</h1>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={refreshData}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalPending}</div>
            <div className="stat-label">Pending Approval</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalApproved}</div>
            <div className="stat-label">Approved Admins</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalRejected}</div>
            <div className="stat-label">Rejected Admins</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalAll}</div>
            <div className="stat-label">Total Admins</div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          ⏳ Pending Admins ({stats.totalPending})
        </button>
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          📋 All Admins ({stats.totalAll})
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-card">
        <div className="search-filter-grid">
          <div className="search-group">
            <label htmlFor="search">Search Users</label>
            <div className="search-input-wrapper">
              <input
                id="search"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by name, email, or ID..."
              />
              <div className="search-icon">🔍</div>
            </div>
          </div>

          {activeTab === "all" && (
            <div className="filter-group">
              <label htmlFor="status-filter">Filter by Status</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>
            {activeTab === "pending" ? "Pending Users" : "All Users"} ({filteredData.length})
          </h3>
          <div className="table-actions">
            <span className="results-info">
              Showing {filteredData.length} {activeTab === "pending" ? "pending" : ""} users
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <span>Loading users...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {activeTab === "pending" ? "⏳" : "👥"}
            </div>
            <h3>
              {activeTab === "pending" ? "No pending users" : "No users found"}
            </h3>
            <p>
              {searchText || statusFilter
                ? "Try adjusting your search or filter criteria"
                : activeTab === "pending"
                  ? "All users have been processed"
                  : "No users available at the moment"
              }
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Admin Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  {activeTab === "pending" && (
                    <>
                      <th>Approve</th>
                      <th>Reject</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td className="user-id">#{user.id}</td>
                    <td className="user-name">{user.adminname}</td>
                    <td className="user-email">{user.email}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    {activeTab === "pending" && (
                      <>
                        <td>
                          <button
                            className="btn-icon btn-approve"
                            onClick={() => approveUser(user.id)}
                            disabled={loading}
                            title="Approve user"
                          >
                            ✅ Approve
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn-icon btn-reject"
                            onClick={() => rejectUser(user.id)}
                            disabled={loading}
                            title="Reject user"
                          >
                            ❌ Reject
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminGetAllData;
