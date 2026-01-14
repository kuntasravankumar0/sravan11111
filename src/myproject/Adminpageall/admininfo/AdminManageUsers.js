import React, { useEffect, useState, useCallback, useMemo } from "react";
import UpdateUserPopup from "./UpdateUserPopup";
import "./AdminManageUsers.css";
import { getAllAdminUsers, deleteAdminUser, approveAdminUser, rejectAdminUser } from "../../../api/admin/adminApi";

function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
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

  // Load users with enhanced error handling
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllAdminUsers();
      const usersData = Array.isArray(res.data) ? res.data : [];
      setUsers(usersData);

      // Calculate stats safely
      const statsObj = usersData.reduce((acc, user) => {
        if (!user) return acc;
        acc.total++;
        if (user.status === 'pending' || user.status === 'PENDING') acc.pending++;
        else if (user.status === 'approved' || user.status === 'APPROVED') acc.approved++;
        else if (user.status === 'rejected' || user.status === 'REJECTED') acc.rejected++;
        return acc;
      }, { total: 0, pending: 0, approved: 0, rejected: 0 });

      setStats(statsObj);
    } catch (err) {
      console.error("LOAD USERS ERROR:", err?.message);
      showMessage("❌ Failed to connect to identity server.", "error");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Enhanced delete with confirmation
  const deleteUser = useCallback(async (customerId) => {
    if (loading) return;

    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    setLoading(true);
    try {
      await deleteAdminUser(customerId);
      showMessage("✅ User deleted successfully!", "success");
      await loadUsers();
    } catch (err) {
      console.error("DELETE ERROR:", err?.message);
      showMessage("❌ Failed to delete user. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [loading, showMessage, loadUsers]);

  // Enhanced approve
  const approveUser = useCallback(async (id) => {
    if (loading) return;

    setLoading(true);
    try {
      await approveAdminUser(id);
      showMessage("✅ User approved successfully!", "success");
      await loadUsers();
    } catch (err) {
      console.error("APPROVE ERROR:", err?.message);
      showMessage("❌ Failed to approve user. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [loading, showMessage, loadUsers]);

  // Enhanced reject
  const rejectUser = useCallback(async (id) => {
    if (loading) return;

    setLoading(true);
    try {
      await rejectAdminUser(id);
      showMessage("⚠️ User rejected successfully!", "warning");
      await loadUsers();
    } catch (err) {
      console.error("REJECT ERROR:", err?.message);
      showMessage("❌ Failed to reject user. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [loading, showMessage, loadUsers]);

  // Sorting functionality
  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  // Filtered and sorted data
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = !searchText ||
        user.adminname?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.customerId?.toString().includes(searchText);

      const matchesStatus = !statusFilter || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [users, searchText, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  // Bulk selection handlers
  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      const allIds = new Set(paginatedUsers.map(user => user.id));
      setSelectedUsers(allIds);
    } else {
      setSelectedUsers(new Set());
    }
  }, [paginatedUsers]);

  const handleSelectUser = useCallback((userId, checked) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  }, []);

  // Show/hide bulk actions
  useEffect(() => {
    setShowBulkActions(selectedUsers.size > 0);
  }, [selectedUsers]);

  // Bulk approve
  const handleBulkApprove = useCallback(async () => {
    if (selectedUsers.size === 0) return;

    const confirmMessage = `Are you sure you want to approve ${selectedUsers.size} selected user${selectedUsers.size > 1 ? 's' : ''}?`;
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const approvePromises = Array.from(selectedUsers).map(userId =>
        approveAdminUser(userId)
      );

      await Promise.all(approvePromises);
      showMessage(`✅ Successfully approved ${selectedUsers.size} user${selectedUsers.size > 1 ? 's' : ''}!`, "success");
      setSelectedUsers(new Set());
      await loadUsers();
    } catch (err) {
      console.error("Bulk approve error:", err);
      showMessage("❌ Failed to approve some users. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedUsers, showMessage, loadUsers]);

  // Bulk reject
  const handleBulkReject = useCallback(async () => {
    if (selectedUsers.size === 0) return;

    const confirmMessage = `Are you sure you want to reject ${selectedUsers.size} selected user${selectedUsers.size > 1 ? 's' : ''}?`;
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const rejectPromises = Array.from(selectedUsers).map(userId =>
        rejectAdminUser(userId)
      );

      await Promise.all(rejectPromises);
      showMessage(`⚠️ Successfully rejected ${selectedUsers.size} user${selectedUsers.size > 1 ? 's' : ''}!`, "warning");
      setSelectedUsers(new Set());
      await loadUsers();
    } catch (err) {
      console.error("Bulk reject error:", err);
      showMessage("❌ Failed to reject some users. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedUsers, showMessage, loadUsers]);

  const getSortIcon = useCallback((columnKey) => {
    if (sortConfig.key !== columnKey) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  }, [sortConfig]);

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

  return (
    <div className="admin-manage-users">
      <div className="header">
        <h1>Admin User Management</h1>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={loadUsers}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bulk-actions-bar">
          <div className="bulk-info">
            <span className="bulk-count">{selectedUsers.size}</span>
            <span className="bulk-text">
              {selectedUsers.size === 1 ? 'user selected' : 'users selected'}
            </span>
          </div>
          <div className="bulk-buttons">
            <button
              className="btn btn-success"
              onClick={handleBulkApprove}
              disabled={loading}
            >
              ✅ Bulk Approve
            </button>
            <button
              className="btn btn-warning"
              onClick={handleBulkReject}
              disabled={loading}
            >
              ❌ Bulk Reject
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedUsers(new Set())}
              disabled={loading}
            >
              ✖️ Clear Selection
            </button>
          </div>
        </div>
      )}

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
                placeholder="Search by name, email, or customer ID..."
              />
              <div className="search-icon">🔍</div>
            </div>
          </div>

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
        </div>
      </div>

      {/* Users Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Users ({filteredAndSortedUsers.length})</h3>
          <div className="table-actions">
            <span className="results-info">
              Showing {paginatedUsers.length} of {filteredAndSortedUsers.length} users
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <span>Loading users...</span>
          </div>
        ) : filteredAndSortedUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No users found</h3>
            <p>
              {searchText || statusFilter
                ? "Try adjusting your search or filter criteria"
                : "No users available at the moment"
              }
            </p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>
                      <div className="checkbox-wrapper">
                        <input
                          type="checkbox"
                          id="select-all"
                          checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <label htmlFor="select-all" className="checkbox-label">
                          All
                        </label>
                      </div>
                    </th>
                    <th
                      className="sortable"
                      onClick={() => handleSort('id')}
                    >
                      ID {getSortIcon('id')}
                    </th>
                    <th
                      className="sortable"
                      onClick={() => handleSort('adminname')}
                    >
                      Name {getSortIcon('adminname')}
                    </th>
                    <th
                      className="sortable"
                      onClick={() => handleSort('email')}
                    >
                      Email {getSortIcon('email')}
                    </th>
                    <th
                      className="sortable"
                      onClick={() => handleSort('customerId')}
                    >
                      Customer ID {getSortIcon('customerId')}
                    </th>
                    <th>Password</th>
                    <th
                      className="sortable"
                      onClick={() => handleSort('status')}
                    >
                      Status {getSortIcon('status')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className={selectedUsers.has(user.id) ? 'selected-row' : ''}>
                      <td>
                        <div className="checkbox-wrapper">
                          <input
                            type="checkbox"
                            id={`select-${user.id}`}
                            checked={selectedUsers.has(user.id)}
                            onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                          />
                          <label htmlFor={`select-${user.id}`} className="checkbox-label"></label>
                        </div>
                      </td>
                      <td className="user-id">#{user.id}</td>
                      <td className="user-name">{user.adminname}</td>
                      <td className="user-email">{user.email}</td>
                      <td className="customer-id">{user.customerId}</td>
                      <td className="password-field">
                        <span className="password-hidden">••••••••</span>
                      </td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-approve"
                            onClick={() => approveUser(user.id)}
                            title="Approve user"
                            disabled={loading || user.status === 'approved'}
                          >
                            ✅
                          </button>
                          <button
                            className="btn-icon btn-reject"
                            onClick={() => rejectUser(user.id)}
                            title="Reject user"
                            disabled={loading || user.status === 'rejected'}
                          >
                            ❌
                          </button>
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => setEditUser(user)}
                            title="Edit user"
                            disabled={loading}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => deleteUser(user.customerId)}
                            title="Delete user"
                            disabled={loading}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-pagination"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <div className="pagination-info">
                  <span>Page {currentPage} of {totalPages}</span>
                </div>

                <button
                  className="btn btn-pagination"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
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

export default AdminManageUsers;
