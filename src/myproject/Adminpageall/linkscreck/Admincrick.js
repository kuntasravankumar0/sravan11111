import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "./Admincrick.css";
import API_BASE_URL from "../../config/apiConfig";

const API = `${API_BASE_URL}/api/cricklinks`;

export default function Admincrick() {
  // Form state - wrapped in useMemo
  const emptyForm = useMemo(() => ({
    crickLinks: "",
    linkTest: "",
    imageUrl: "",
    cmdCommandSetup: "",
    videoLink: "",
    aboutSoftware: ""
  }), []);

  const [form, setForm] = useState(emptyForm);
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedRecords, setSelectedRecords] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    withImages: 0,
    withVideos: 0,
    recentlyAdded: 0
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

  // Input handler with validation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const errors = [];
    if (!form.crickLinks.trim()) errors.push("Title is required");
    if (!form.linkTest.trim()) errors.push("Download link is required");

    // URL validation for links
    if (form.linkTest && !isValidUrl(form.linkTest)) {
      errors.push("Please enter a valid download link");
    }
    if (form.videoLink && !isValidUrl(form.videoLink)) {
      errors.push("Please enter a valid video link");
    }
    if (form.imageUrl && !isValidUrl(form.imageUrl)) {
      errors.push("Please enter a valid image URL");
    }

    if (errors.length > 0) {
      showMessage(errors.join(", "), "error");
      return false;
    }
    return true;
  }, [form, showMessage]);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Enhanced fetch all with stats calculation
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API, { timeout: 10000 });
      const records = res.data || [];
      setData(records);

      // Calculate stats
      const stats = records.reduce((acc, record) => {
        acc.total++;
        if (record.imageUrl) acc.withImages++;
        if (record.videoLink) acc.withVideos++;

        // Check if recently added (within last 7 days)
        const recordDate = new Date(record.createdAt || Date.now());
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        if (recordDate > weekAgo) acc.recentlyAdded++;

        return acc;
      }, { total: 0, withImages: 0, withVideos: 0, recentlyAdded: 0 });

      setStats(stats);
      showMessage(`📦 Loaded ${records.length} records successfully`, "success");
    } catch (err) {
      console.error("Fetch error:", err);
      showMessage("❌ Failed to load records. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  // Enhanced create with validation
  const handlePost = useCallback(async () => {
    if (loading || !validateForm()) return;

    try {
      setLoading(true);
      await axios.post(API, form, { timeout: 10000 });
      showMessage("✅ Record created successfully!", "success");
      setForm(emptyForm);
      await fetchAll();
    } catch (err) {
      console.error("Create error:", err);
      showMessage("❌ Failed to create record. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [loading, validateForm, form, showMessage, emptyForm, fetchAll]);

  // Enhanced fetch by ID with auto-populate
  const fetchById = useCallback(async () => {
    if (!id.trim()) {
      showMessage("Please enter an ID", "warning");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API}/${id}`, { timeout: 10000 });
      const record = res.data;

      setData([record]);
      setForm({
        crickLinks: record.crickLinks || "",
        linkTest: record.linkTest || "",
        imageUrl: record.imageUrl || "",
        cmdCommandSetup: record.cmdCommandSetup || "",
        videoLink: record.videoLink || "",
        aboutSoftware: record.aboutSoftware || ""
      });

      setIsEditing(true);
      showMessage("🔍 Record loaded for editing", "info");
    } catch (err) {
      console.error("Fetch by ID error:", err);
      showMessage("❌ Record not found", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showMessage]);

  // Enhanced fetch by customer
  const fetchByCustomer = useCallback(async () => {
    if (!customerId.trim()) {
      showMessage("Please enter a Customer ID", "warning");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API}/customer/${customerId}`, { timeout: 10000 });
      const records = res.data || [];
      setData(records);
      showMessage(`🔍 Found ${records.length} customer records`, "info");
    } catch (err) {
      console.error("Fetch by customer error:", err);
      showMessage("❌ No records found for this customer", "error");
    } finally {
      setLoading(false);
    }
  }, [customerId, showMessage]);

  // Enhanced update with validation
  const updateById = useCallback(async () => {
    if (!id.trim()) {
      showMessage("Please enter an ID to update", "warning");
      return;
    }

    if (loading || !validateForm()) return;

    try {
      setLoading(true);
      await axios.put(`${API}/${id}`, form, { timeout: 10000 });
      showMessage("✏️ Record updated successfully!", "success");
      setIsEditing(false);
      await fetchAll();
    } catch (err) {
      console.error("Update error:", err);
      showMessage("❌ Failed to update record. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [id, loading, validateForm, form, showMessage, fetchAll]);

  // Enhanced delete with confirmation
  const deleteById = useCallback(async () => {
    if (!id.trim()) {
      showMessage("Please enter an ID to delete", "warning");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) return;

    try {
      setLoading(true);
      await axios.delete(`${API}/${id}`, { timeout: 10000 });
      showMessage("🗑️ Record deleted successfully!", "success");
      setForm(emptyForm);
      setIsEditing(false);
      await fetchAll();
    } catch (err) {
      console.error("Delete error:", err);
      showMessage("❌ Failed to delete record. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showMessage, emptyForm, fetchAll]);

  // Enhanced delete by customer with confirmation
  const deleteByCustomer = useCallback(async () => {
    if (!customerId.trim()) {
      showMessage("Please enter a Customer ID to delete", "warning");
      return;
    }

    if (!window.confirm("Are you sure you want to delete all records for this customer? This action cannot be undone.")) return;

    try {
      setLoading(true);
      await axios.delete(`${API}/customer/${customerId}`, { timeout: 10000 });
      showMessage("🗑️ Customer records deleted successfully!", "success");
      await fetchAll();
    } catch (err) {
      console.error("Delete customer error:", err);
      showMessage("❌ Failed to delete customer records. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [customerId, showMessage, fetchAll]);

  // Reset form
  const resetForm = useCallback(() => {
    setForm(emptyForm);
    setId("");
    setIsEditing(false);
  }, [emptyForm]);

  // Sorting functionality
  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(record => {
      if (!searchText) return true;

      const searchLower = searchText.toLowerCase();
      return (
        record.crickLinks?.toLowerCase().includes(searchLower) ||
        record.linkTest?.toLowerCase().includes(searchLower) ||
        record.cmdCommandSetup?.toLowerCase().includes(searchLower) ||
        record.aboutSoftware?.toLowerCase().includes(searchLower) ||
        record.id?.toString().includes(searchText) ||
        record.customerId?.toString().includes(searchText)
      );
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
  }, [data, searchText, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  // Bulk selection handlers
  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      const allIds = new Set(paginatedData.map(record => record.id));
      setSelectedRecords(allIds);
    } else {
      setSelectedRecords(new Set());
    }
  }, [paginatedData]);

  const handleSelectRecord = useCallback((recordId, checked) => {
    setSelectedRecords(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(recordId);
      } else {
        newSet.delete(recordId);
      }
      return newSet;
    });
  }, []);

  // Show/hide bulk actions
  useEffect(() => {
    setShowBulkActions(selectedRecords.size > 0);
  }, [selectedRecords]);

  // Bulk delete
  const handleBulkDelete = useCallback(async () => {
    if (selectedRecords.size === 0) return;

    const confirmMessage = `Are you sure you want to delete ${selectedRecords.size} selected record${selectedRecords.size > 1 ? 's' : ''}? This action cannot be undone.`;
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const deletePromises = Array.from(selectedRecords).map(recordId =>
        axios.delete(`${API}/${recordId}`, { timeout: 10000 })
      );

      await Promise.all(deletePromises);
      showMessage(`✅ Successfully deleted ${selectedRecords.size} record${selectedRecords.size > 1 ? 's' : ''}!`, "success");
      setSelectedRecords(new Set());
      await fetchAll();
    } catch (err) {
      console.error("Bulk delete error:", err);
      showMessage("❌ Failed to delete some records. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedRecords, showMessage, fetchAll]);

  const getSortIcon = useCallback((columnKey) => {
    if (sortConfig.key !== columnKey) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  }, [sortConfig]);

  // Load data on component mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="admincrick-container">
      <div className="header">
        <h1>CrickLinks Admin Panel</h1>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={fetchAll}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Records</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🖼️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.withImages}</div>
            <div className="stat-label">With Images</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.withVideos}</div>
            <div className="stat-label">With Videos</div>
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

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bulk-actions-bar">
          <div className="bulk-info">
            <span className="bulk-count">{selectedRecords.size}</span>
            <span className="bulk-text">
              {selectedRecords.size === 1 ? 'record selected' : 'records selected'}
            </span>
          </div>
          <div className="bulk-buttons">
            <button
              className="btn btn-danger"
              onClick={handleBulkDelete}
              disabled={loading}
            >
              🗑️ Delete Selected
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedRecords(new Set())}
              disabled={loading}
            >
              ✖️ Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Create / Update Form */}
      <div className="form-card">
        <div className="form-header">
          <h2>{isEditing ? 'Update Record' : 'Create New Record'}</h2>
          {isEditing && (
            <div className="edit-info">
              <span>Editing ID: {id}</span>
            </div>
          )}
        </div>

        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="crickLinks">Title *</label>
            <input
              id="crickLinks"
              name="crickLinks"
              value={form.crickLinks}
              onChange={handleChange}
              placeholder="Enter title"
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="linkTest">Download Link *</label>
            <input
              id="linkTest"
              name="linkTest"
              type="url"
              value={form.linkTest}
              onChange={handleChange}
              placeholder="https://example.com/download"
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="videoLink">Video Link</label>
            <input
              id="videoLink"
              name="videoLink"
              type="url"
              value={form.videoLink}
              onChange={handleChange}
              placeholder="https://example.com/video"
              disabled={loading}
            />
          </div>

          <div className="input-group full-width">
            <label htmlFor="cmdCommandSetup">CMD Command Setup</label>
            <input
              id="cmdCommandSetup"
              name="cmdCommandSetup"
              value={form.cmdCommandSetup}
              onChange={handleChange}
              placeholder="Enter command setup instructions"
              disabled={loading}
            />
          </div>

          <div className="input-group full-width">
            <label htmlFor="aboutSoftware">About Software</label>
            <textarea
              id="aboutSoftware"
              name="aboutSoftware"
              value={form.aboutSoftware}
              onChange={handleChange}
              placeholder="Enter software description"
              disabled={loading}
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          {isEditing ? (
            <button
              className="btn btn-success"
              onClick={updateById}
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : '✏️ Update Record'}
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={handlePost}
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : '➕ Create Record'}
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={resetForm}
            disabled={loading}
          >
            🔄 Reset Form
          </button>
        </div>
      </div>

      {/* Search and Operations */}
      <div className="operations-card">
        <div className="operations-header">
          <h2>Search & Operations</h2>
        </div>

        <div className="operations-grid">
          <div className="search-group">
            <label htmlFor="search">Search Records</label>
            <div className="search-input-wrapper">
              <input
                id="search"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by title, link, command, or description..."
              />
              <div className="search-icon">🔍</div>
            </div>
          </div>

          <div className="operations-group">
            <label htmlFor="id-input">Operations by ID</label>
            <div className="operation-row">
              <input
                id="id-input"
                placeholder="Enter ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <div className="operation-buttons">
                <button
                  className="btn btn-info"
                  onClick={fetchById}
                  disabled={loading}
                >
                  🔍 Get by ID
                </button>
                <button
                  className="btn btn-danger"
                  onClick={deleteById}
                  disabled={loading}
                >
                  🗑️ Delete by ID
                </button>
              </div>
            </div>
          </div>

          <div className="operations-group">
            <label htmlFor="customer-input">Operations by Customer</label>
            <div className="operation-row">
              <input
                id="customer-input"
                placeholder="Enter Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
              <div className="operation-buttons">
                <button
                  className="btn btn-info"
                  onClick={fetchByCustomer}
                  disabled={loading}
                >
                  🔍 Get by Customer
                </button>
                <button
                  className="btn btn-danger"
                  onClick={deleteByCustomer}
                  disabled={loading}
                >
                  🗑️ Delete by Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Records Display */}
      <div className="records-card">
        <div className="records-header">
          <h2>Records ({filteredAndSortedData.length})</h2>
          <div className="records-actions">
            <div className="sort-controls">
              <label>Sort by:</label>
              <select
                value={sortConfig.key || ''}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="">Default</option>
                <option value="id">ID {getSortIcon('id')}</option>
                <option value="crickLinks">Title {getSortIcon('crickLinks')}</option>
                <option value="customerId">Customer ID {getSortIcon('customerId')}</option>
              </select>
            </div>
            <span className="results-info">
              Showing {paginatedData.length} of {filteredAndSortedData.length} records
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <span>Loading records...</span>
          </div>
        ) : filteredAndSortedData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No records found</h3>
            <p>
              {searchText
                ? "Try adjusting your search criteria"
                : "Get started by creating your first record"
              }
            </p>
            {!searchText && (
              <button
                className="btn btn-primary"
                onClick={() => document.getElementById('crickLinks').focus()}
              >
                Create First Record
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="records-controls">
              <div className="bulk-select">
                <input
                  type="checkbox"
                  id="select-all-records"
                  checked={selectedRecords.size === paginatedData.length && paginatedData.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <label htmlFor="select-all-records">Select All</label>
              </div>
            </div>

            <div className="records-grid">
              {paginatedData.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  isSelected={selectedRecords.has(record.id)}
                  onSelect={(checked) => handleSelectRecord(record.id, checked)}
                  onEdit={() => {
                    setId(record.id.toString());
                    fetchById();
                  }}
                  onDelete={() => {
                    setId(record.id.toString());
                    deleteById();
                  }}
                />
              ))}
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

/* Enhanced Record Card Component */
function RecordCard({ record, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <div className={`record-card ${isSelected ? 'selected' : ''}`}>
      <div className="record-select">
        <input
          type="checkbox"
          id={`select-${record.id}`}
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
        />
        <label htmlFor={`select-${record.id}`}></label>
      </div>

      <div className="record-header">
        <span className="record-id">ID: {record.id}</span>
        <span className="customer-id">Customer: {record.customerId}</span>
      </div>

      <div className="record-body">
        <Field label="Title" value={record.crickLinks} />
        <Field
          label="Download Link"
          value={
            record.linkTest ? (
              <a href={record.linkTest} target="_blank" rel="noreferrer" className="download-link">
                🔗 Download
              </a>
            ) : "-"
          }
        />
        <Field label="CMD Command" value={record.cmdCommandSetup || "-"} />
        <Field label="About" value={record.aboutSoftware || "-"} />

        <Field
          label="Video Link"
          value={
            record.videoLink ? (
              <VideoPlayer videoUrl={record.videoLink} />
            ) : "-"
          }
        />

        <Field
          label="Image"
          value={
            record.imageUrl ? (
              <div className="image-container">
                <img src={record.imageUrl} alt="preview" />
              </div>
            ) : (
              <div className="no-image">No image available</div>
            )
          }
        />
      </div>

      <div className="record-actions">
        <button
          className="btn-icon btn-edit"
          onClick={onEdit}
          title="Edit record"
        >
          ✏️
        </button>
        <button
          className="btn-icon btn-delete"
          onClick={onDelete}
          title="Delete record"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

/* Field Component */
function Field({ label, value }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="field-value">{value}</div>
    </div>
  );
}

/* Video Player Component */
function VideoPlayer({ videoUrl }) {
  const [showPlayer, setShowPlayer] = useState(false);

  // Extract video ID for different platforms
  const getVideoInfo = (url) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return {
        platform: 'youtube',
        id: youtubeMatch[1],
        thumbnail: `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`
      };
    }

    // Mega.nz embed - more flexible detection
    if (url.includes('mega.nz/embed/') || url.includes('mega.co.nz/embed/')) {
      return {
        platform: 'mega',
        id: 'embed',
        key: '',
        thumbnail: null,
        embedUrl: url
      };
    }

    // Mega.nz regular link - convert to embed
    const megaRegularMatch = url.match(/mega\.(?:nz|co\.nz)\/(?:file\/|#!)([^!]+)!(.+)/);
    if (megaRegularMatch) {
      const fileId = megaRegularMatch[1];
      const key = megaRegularMatch[2];
      return {
        platform: 'mega',
        id: fileId,
        key: key,
        thumbnail: null,
        embedUrl: `https://mega.nz/embed/${fileId}#${key}`
      };
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return {
        platform: 'vimeo',
        id: vimeoMatch[1],
        thumbnail: `https://vumbnail.com/${vimeoMatch[1]}.jpg`,
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
      };
    }

    // Generic video file
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return {
        platform: 'direct',
        url: url,
        thumbnail: null,
        embedUrl: url
      };
    }

    return {
      platform: 'unknown',
      url: url,
      thumbnail: null,
      embedUrl: url
    };
  };

  const videoInfo = getVideoInfo(videoUrl);

  // Debug log for Mega.nz
  if (videoInfo.platform === 'mega') {
    console.log('Mega.nz detected:', {
      originalUrl: videoUrl,
      embedUrl: videoInfo.embedUrl,
      platform: videoInfo.platform
    });
  }

  const handlePlayClick = () => {
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
  };

  return (
    <div className="video-player-container">
      {!showPlayer ? (
        <div className="video-thumbnail" onClick={handlePlayClick}>
          {videoInfo.thumbnail ? (
            <div className="thumbnail-wrapper">
              <img
                src={videoInfo.thumbnail}
                alt="Video thumbnail"
                className="video-thumbnail-img"
              />
              <div className="play-overlay">
                <div className="play-button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="video-placeholder">
              <div className="video-icon">
                {videoInfo.platform === 'youtube' && '📺'}
                {videoInfo.platform === 'mega' && '☁️'}
                {videoInfo.platform === 'vimeo' && '🎬'}
                {videoInfo.platform === 'direct' && '🎥'}
                {videoInfo.platform === 'unknown' && '🎥'}
              </div>
              <div className="video-text">
                {videoInfo.platform === 'youtube' && 'YouTube Video'}
                {videoInfo.platform === 'mega' && 'Mega.nz Video'}
                {videoInfo.platform === 'vimeo' && 'Vimeo Video'}
                {videoInfo.platform === 'direct' && 'Video File'}
                {videoInfo.platform === 'unknown' && 'Click to Play Video'}
              </div>
              <div className="platform-badge">
                {videoInfo.platform.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="video-player-wrapper">
          <div className="video-player-header">
            <span className="video-title">
              {videoInfo.platform === 'youtube' && '📺 YouTube Player'}
              {videoInfo.platform === 'mega' && '☁️ Mega.nz Player'}
              {videoInfo.platform === 'vimeo' && '🎬 Vimeo Player'}
              {videoInfo.platform === 'direct' && '🎥 Video Player'}
              {videoInfo.platform === 'unknown' && '🎥 Video Player'}
            </span>
            <button className="close-video" onClick={handleClosePlayer}>
              ✖️
            </button>
          </div>
          <div className="video-embed">
            {videoInfo.platform === 'youtube' && (
              <iframe
                width="100%"
                height="200"
                src={`${videoInfo.embedUrl}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
            {videoInfo.platform === 'mega' && (
              <div className="mega-player-container">
                <iframe
                  width="100%"
                  height="200"
                  frameBorder="0"
                  src={videoInfo.embedUrl}
                  title="Mega.nz video player"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups"
                  style={{ border: 'none' }}
                ></iframe>
                <div className="mega-info">
                  <small>Mega.nz Player - {videoInfo.embedUrl}</small>
                </div>
              </div>
            )}
            {videoInfo.platform === 'vimeo' && (
              <iframe
                width="100%"
                height="200"
                src={`${videoInfo.embedUrl}?autoplay=1`}
                title="Vimeo video player"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
            {videoInfo.platform === 'direct' && (
              <video
                width="100%"
                height="200"
                controls
                autoPlay
                className="direct-video"
              >
                <source src={videoInfo.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {videoInfo.platform === 'unknown' && (
              <div className="unknown-video">
                <p>Trying to load video...</p>
                <iframe
                  width="100%"
                  height="200"
                  src={videoUrl}
                  title="Video player"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
