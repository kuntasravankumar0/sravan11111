import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "./LinksManager.css";
import API_BASE_URL from "../../config/apiConfig";

const LINKS_API = `${API_BASE_URL}/api/links`;

function LinksManager() {
  const [links, setLinks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    linkname: "",
    categary: "",
    usenote: "",
    links: "",
  });

  const [editNumber, setEditNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    recentlyAdded: 0
  });

  // Bulk operations state
  const [selectedLinks, setSelectedLinks] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [bulkUpdateForm, setBulkUpdateForm] = useState({
    categary: "",
    usenote: ""
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

  // Load all links with enhanced error handling
  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${LINKS_API}/all`, {
        timeout: 10000
      });
      const linksData = res.data || [];
      setLinks(linksData);

      // Calculate stats
      const categories = [...new Set(linksData.map(link => link.categary))].length;
      const recentlyAdded = linksData.filter(link => {
        const linkDate = new Date(link.createdAt || Date.now());
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return linkDate > weekAgo;
      }).length;

      setStats({
        total: linksData.length,
        categories,
        recentlyAdded
      });
    } catch (err) {
      console.error("LOAD ERROR:", err);
      showMessage("Failed to load links. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const resetForm = useCallback(() => {
    setForm({ linkname: "", categary: "", usenote: "", links: "" });
    setEditNumber("");
    setIsEditing(false);
  }, []);

  // Auto fetch for update with debouncing
  useEffect(() => {
    if (!editNumber.trim()) {
      resetForm();
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await axios.get(`${LINKS_API}/getby/${editNumber}`);
        const item = res.data;
        if (item) {
          setForm({
            linkname: item.linkname || "",
            categary: item.categary || "",
            usenote: item.usenote || "",
            links: item.links || "",
          });
          setIsEditing(true);
          setShowForm(true);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        showMessage("Link not found", "warning");
        resetForm();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [editNumber, showMessage, resetForm]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  // Enhanced form validation
  const validateForm = useCallback(() => {
    const errors = [];
    if (!form.linkname.trim()) errors.push("Link name is required");
    if (!form.categary.trim()) errors.push("Category is required");
    if (!form.links.trim()) errors.push("URL is required");

    // URL validation
    try {
      new URL(form.links);
    } catch {
      errors.push("Please enter a valid URL");
    }

    if (errors.length > 0) {
      showMessage(errors.join(", "), "error");
      return false;
    }
    return true;
  }, [form, showMessage]);

  // Add link with validation
  const addLink = useCallback(async () => {
    if (loading || !validateForm()) return;

    setLoading(true);
    try {
      await axios.post(`${LINKS_API}/create`, form, {
        timeout: 10000
      });
      showMessage("✅ Link added successfully!", "success");
      await loadAll();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Add error:", err);
      showMessage("❌ Failed to add link. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [loading, validateForm, form, showMessage, loadAll, resetForm]);

  // Update link with validation
  const updateLink = useCallback(async () => {
    if (!editNumber) {
      showMessage("⚠ Enter link number to update", "warning");
      return;
    }

    if (loading || !validateForm()) return;

    setLoading(true);
    try {
      await axios.put(`${LINKS_API}/update/${editNumber}`, form, {
        timeout: 10000
      });
      showMessage("✅ Link updated successfully!", "success");
      await loadAll();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Update error:", err);
      showMessage("❌ Failed to update link. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [editNumber, loading, validateForm, form, showMessage, loadAll, resetForm]);

  // Delete link with confirmation
  const deleteLink = useCallback(async (linkNumber) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    setLoading(true);
    try {
      await axios.delete(`${LINKS_API}/delete/${linkNumber}`, {
        timeout: 10000
      });
      showMessage("✅ Link deleted successfully!", "success");
      await loadAll();
    } catch (err) {
      console.error("Delete error:", err);
      showMessage("❌ Failed to delete link. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showMessage, loadAll]);

  // Enhanced sorting
  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  // Memoized filtered and sorted data
  const filteredAndSortedLinks = useMemo(() => {
    let filtered = links.filter(link => {
      const matchesSearch = !searchText ||
        link.linkname?.toLowerCase().includes(searchText.toLowerCase()) ||
        link.categary?.toLowerCase().includes(searchText.toLowerCase()) ||
        link.usenote?.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory = !selectedCategory || link.categary === selectedCategory;

      return matchesSearch && matchesCategory;
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
  }, [links, searchText, selectedCategory, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedLinks.length / itemsPerPage);
  const paginatedLinks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedLinks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedLinks, currentPage, itemsPerPage]);

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(links.map(link => link.categary))].filter(Boolean);
  }, [links]);

  const editLinkHandler = useCallback((linkNumber) => {
    setEditNumber(linkNumber.toString());
  }, []);

  const getSortIcon = useCallback((columnKey) => {
    if (sortConfig.key !== columnKey) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  }, [sortConfig]);

  // Bulk selection handlers
  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      const allIds = new Set(paginatedLinks.map(link => link.linknumber));
      setSelectedLinks(allIds);
    } else {
      setSelectedLinks(new Set());
    }
  }, [paginatedLinks]);

  const handleSelectLink = useCallback((linkNumber, checked) => {
    setSelectedLinks(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(linkNumber);
      } else {
        newSet.delete(linkNumber);
      }
      return newSet;
    });
  }, []);

  // Show/hide bulk actions based on selection
  useEffect(() => {
    setShowBulkActions(selectedLinks.size > 0);
  }, [selectedLinks]);

  // Bulk delete with confirmation
  const handleBulkDelete = useCallback(async () => {
    if (selectedLinks.size === 0) return;

    const confirmMessage = `Are you sure you want to delete ${selectedLinks.size} selected link${selectedLinks.size > 1 ? 's' : ''}?`;
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const deletePromises = Array.from(selectedLinks).map(linkNumber =>
        axios.delete(`${LINKS_API}/delete/${linkNumber}`, { timeout: 10000 })
      );

      await Promise.all(deletePromises);
      showMessage(`✅ Successfully deleted ${selectedLinks.size} link${selectedLinks.size > 1 ? 's' : ''}!`, "success");
      setSelectedLinks(new Set());
      await loadAll();
    } catch (err) {
      console.error("Bulk delete error:", err);
      showMessage("❌ Failed to delete some links. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedLinks, showMessage, loadAll]);

  // Bulk update handlers
  const handleBulkUpdateChange = useCallback((e) => {
    const { name, value } = e.target;
    setBulkUpdateForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleBulkUpdate = useCallback(async () => {
    if (selectedLinks.size === 0) return;

    // Validate at least one field is filled
    if (!bulkUpdateForm.categary.trim() && !bulkUpdateForm.usenote.trim()) {
      showMessage("Please fill at least one field to update", "warning");
      return;
    }

    setLoading(true);
    try {
      const updatePromises = Array.from(selectedLinks).map(async (linkNumber) => {
        // Get current link data
        const currentRes = await axios.get(`${LINKS_API}/getby/${linkNumber}`);
        const currentData = currentRes.data;

        // Prepare update data (only update non-empty fields)
        const updateData = {
          linkname: currentData.linkname,
          categary: bulkUpdateForm.categary.trim() || currentData.categary,
          usenote: bulkUpdateForm.usenote.trim() || currentData.usenote,
          links: currentData.links
        };

        return axios.put(`${LINKS_API}/update/${linkNumber}`, updateData, { timeout: 10000 });
      });

      await Promise.all(updatePromises);
      showMessage(`✅ Successfully updated ${selectedLinks.size} link${selectedLinks.size > 1 ? 's' : ''}!`, "success");
      setSelectedLinks(new Set());
      setBulkUpdateForm({ categary: "", usenote: "" });
      setShowBulkUpdateModal(false);
      await loadAll();
    } catch (err) {
      console.error("Bulk update error:", err);
      showMessage("❌ Failed to update some links. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedLinks, bulkUpdateForm, showMessage, loadAll]);

  return (
    <div className="links-manager">
      <div className="header">
        <h1>Links Manager</h1>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={loadAll}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : '🔄 Refresh'}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) resetForm();
            }}
          >
            {showForm ? 'Cancel' : '➕ Add New'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Links</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <div className="stat-number">{stats.categories}</div>
            <div className="stat-label">Categories</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <div className="stat-number">{stats.recentlyAdded}</div>
            <div className="stat-label">Recent</div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="form-card">
          <div className="form-header">
            <h3>{isEditing ? 'Edit Link' : 'Add New Link'}</h3>
            {isEditing && (
              <div className="edit-info">
                <span>Editing Link #{editNumber}</span>
              </div>
            )}
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="linkname">Link Name *</label>
              <input
                id="linkname"
                type="text"
                name="linkname"
                value={form.linkname}
                onChange={handleChange}
                placeholder="Enter link name"
                disabled={loading}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="categary">Category *</label>
              <input
                id="categary"
                type="text"
                name="categary"
                value={form.categary}
                onChange={handleChange}
                placeholder="Enter category"
                disabled={loading}
                list="categories"
                required
              />
              <datalist id="categories">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div className="input-group">
              <label htmlFor="usenote">Use Note</label>
              <input
                id="usenote"
                type="text"
                name="usenote"
                value={form.usenote}
                onChange={handleChange}
                placeholder="Enter usage note"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="links">URL *</label>
              <input
                id="links"
                type="url"
                name="links"
                value={form.links}
                onChange={handleChange}
                placeholder="https://example.com"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            {isEditing ? (
              <button
                className="btn btn-success"
                onClick={updateLink}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Link'}
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={addLink}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Link'}
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bulk-actions-bar">
          <div className="bulk-info">
            <span className="bulk-count">{selectedLinks.size}</span>
            <span className="bulk-text">
              {selectedLinks.size === 1 ? 'link selected' : 'links selected'}
            </span>
          </div>
          <div className="bulk-buttons">
            <button
              className="btn btn-warning"
              onClick={() => setShowBulkUpdateModal(true)}
              disabled={loading}
            >
              📝 Bulk Update
            </button>
            <button
              className="btn btn-danger"
              onClick={handleBulkDelete}
              disabled={loading}
            >
              🗑️ Delete Selected
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedLinks(new Set())}
              disabled={loading}
            >
              ✖️ Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Bulk Update Modal */}
      {showBulkUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Bulk Update Links</h3>
              <button
                className="modal-close"
                onClick={() => setShowBulkUpdateModal(false)}
              >
                ✖️
              </button>
            </div>
            <div className="modal-body">
              <p className="bulk-update-info">
                Updating {selectedLinks.size} selected link{selectedLinks.size > 1 ? 's' : ''}.
                Leave fields empty to keep current values.
              </p>
              <div className="bulk-form-grid">
                <div className="input-group">
                  <label htmlFor="bulk-category">New Category</label>
                  <input
                    id="bulk-category"
                    type="text"
                    name="categary"
                    value={bulkUpdateForm.categary}
                    onChange={handleBulkUpdateChange}
                    placeholder="Enter new category (optional)"
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div className="input-group">
                  <label htmlFor="bulk-note">New Use Note</label>
                  <input
                    id="bulk-note"
                    type="text"
                    name="usenote"
                    value={bulkUpdateForm.usenote}
                    onChange={handleBulkUpdateChange}
                    placeholder="Enter new use note (optional)"
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-success"
                onClick={handleBulkUpdate}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Links'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowBulkUpdateModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="search-filter-card">
        <div className="search-filter-grid">
          <div className="search-group">
            <label htmlFor="search">Search Links</label>
            <div className="search-input-wrapper">
              <input
                id="search"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by name, category, or note..."
              />
              <div className="search-icon">🔍</div>
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="category-filter">Filter by Category</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="quick-edit-group">
            <label htmlFor="edit-number">Quick Edit</label>
            <input
              id="edit-number"
              type="text"
              value={editNumber}
              onChange={(e) => setEditNumber(e.target.value)}
              placeholder="Enter link number"
            />
          </div>
        </div>
      </div>

      {/* Links Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Links ({filteredAndSortedLinks.length})</h3>
          <div className="table-actions">
            <span className="results-info">
              Showing {paginatedLinks.length} of {filteredAndSortedLinks.length} links
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <span>Loading links...</span>
          </div>
        ) : filteredAndSortedLinks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔗</div>
            <h3>No links found</h3>
            <p>
              {searchText || selectedCategory
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first link"
              }
            </p>
            {!searchText && !selectedCategory && (
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Add First Link
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="links-table">
                <thead>
                  <tr>
                    <th>
                      <div className="checkbox-wrapper">
                        <input
                          type="checkbox"
                          id="select-all"
                          checked={selectedLinks.size === paginatedLinks.length && paginatedLinks.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <label htmlFor="select-all" className="checkbox-label">
                          All
                        </label>
                      </div>
                    </th>
                    <th>#</th>
                    <th
                      className="sortable"
                      onClick={() => handleSort('linkname')}
                    >
                      Name {getSortIcon('linkname')}
                    </th>
                    <th
                      className="sortable"
                      onClick={() => handleSort('categary')}
                    >
                      Category {getSortIcon('categary')}
                    </th>
                    <th>Use Note</th>
                    <th>Link</th>
                    <th
                      className="sortable"
                      onClick={() => handleSort('linknumber')}
                    >
                      ID {getSortIcon('linknumber')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLinks.map((item, index) => (
                    <tr key={item.linknumber} className={selectedLinks.has(item.linknumber) ? 'selected-row' : ''}>
                      <td>
                        <div className="checkbox-wrapper">
                          <input
                            type="checkbox"
                            id={`select-${item.linknumber}`}
                            checked={selectedLinks.has(item.linknumber)}
                            onChange={(e) => handleSelectLink(item.linknumber, e.target.checked)}
                          />
                          <label htmlFor={`select-${item.linknumber}`} className="checkbox-label"></label>
                        </div>
                      </td>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="link-name">{item.linkname}</td>
                      <td>
                        <span className="category-badge">
                          {item.categary}
                        </span>
                      </td>
                      <td className="use-note">{item.usenote || '-'}</td>
                      <td>
                        <a
                          href={item.links}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-url"
                        >
                          Open Link 🔗
                        </a>
                      </td>
                      <td className="link-id">#{item.linknumber}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => editLinkHandler(item.linknumber)}
                            title="Edit link"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => deleteLink(item.linknumber)}
                            title="Delete link"
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
    </div>
  );
}

export default LinksManager;
