import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CustomerCrickLinks.css";
import API_BASE_URL from "../../config/apiConfig";

const API = `${API_BASE_URL}/api/cricklinks`;

export default function CustomerCrickLinks() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [stats, setStats] = useState({
    total: 0,
    withImages: 0,
    categories: 0
  });

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(API, { timeout: 10000 });
      const data = res.data || [];

      const unique = [
        ...new Map(
          data
            .filter(item => item.customerId)
            .sort((a, b) => b.customerId.localeCompare(a.customerId))
            .map(item => [
              item.customerId,
              {
                customerId: item.customerId,
                imageUrl: item.imageUrl,
                crickLinks: item.crickLinks,
                id: item.id,
                aboutSoftware: item.aboutSoftware,
                videoLink: item.videoLink,
                linkTest: item.linkTest,
                createdAt: item.createdAt
              },
            ])
        ).values(),
      ];

      // Calculate stats
      const stats = {
        total: unique.length,
        withImages: unique.filter(item => item.imageUrl).length,
        categories: [...new Set(unique.map(item => item.customerId))].length
      };

      setCustomers(unique);
      setFilteredCustomers(unique);
      setStats(stats);
    } catch (err) {
      console.error("Load customers error:", err);
      setError("Failed to load drive links. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterAndSortCustomers = useMemo(() => {
    let filtered = customers;

    // Apply search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = customers.filter(c =>
        (typeof c.crickLinks === "string" && c.crickLinks.toLowerCase().includes(query)) ||
        (typeof c.customerId === "string" && c.customerId.toLowerCase().includes(query)) ||
        (typeof c.aboutSoftware === "string" && c.aboutSoftware.toLowerCase().includes(query))
      );
    }

    // Apply sorting
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
  }, [customers, search, sortConfig]);

  useEffect(() => {
    setFilteredCustomers(filterAndSortCustomers);
  }, [filterAndSortCustomers]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const getSortIcon = useCallback((columnKey) => {
    if (sortConfig.key !== columnKey) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  }, [sortConfig]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="customer-links-container">
      <div className="header">
        <h1>Drive Links Collection</h1>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={loadCustomers}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : '🔄 Refresh'}
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
          <div className="stat-icon">🖼️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.withImages}</div>
            <div className="stat-label">With Images</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <div className="stat-number">{stats.categories}</div>
            <div className="stat-label">Categories</div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="controls-section">
        <div className="search-controls">
          <div className="search-group">
            <label htmlFor="search">Search Drive Links</label>
            <div className="search-input-wrapper">
              <input
                id="search"
                type="text"
                placeholder="Search by name, ID, or description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="search-icon">🔍</div>
            </div>
          </div>

          <div className="sort-controls">
            <label>Sort by:</label>
            <select
              value={sortConfig.key || ''}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="">Default</option>
              <option value="crickLinks">Name {getSortIcon('crickLinks')}</option>
              <option value="customerId">Customer ID {getSortIcon('customerId')}</option>
              <option value="createdAt">Date {getSortIcon('createdAt')}</option>
            </select>
          </div>

          <div className="view-controls">
            <label>View:</label>
            <div className="view-buttons">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞ Grid
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰ List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-section">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <span>Loading drive links...</span>
          </div>
        )}

        {!loading && error && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Error Loading Links</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadCustomers}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredCustomers.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔗</div>
            <h3>No Links Found</h3>
            <p>
              {search.trim()
                ? "Try adjusting your search criteria"
                : "No drive links are available at the moment"
              }
            </p>
            {search.trim() && (
              <button
                className="btn btn-secondary"
                onClick={() => setSearch('')}
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {!loading && !error && filteredCustomers.length > 0 && (
          <>
            <div className="results-info">
              <span>Showing {filteredCustomers.length} of {customers.length} links</span>
            </div>

            <div className={`customer-grid ${viewMode}`}>
              {filteredCustomers.map(customer => (
                <CustomerCard
                  key={customer.customerId}
                  customer={customer}
                  viewMode={viewMode}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* Customer Card Component */
function CustomerCard({ customer, viewMode, formatDate }) {
  return (
    <Link
      to={`/crick-links/${customer.customerId}`}
      className={`customer-card ${viewMode}`}
    >
      {customer.imageUrl && (
        <div className="customer-image-wrapper">
          <img
            src={customer.imageUrl}
            alt="Software preview"
            className="customer-image"
          />
          <div className="image-overlay">
            <span>View Details</span>
          </div>
        </div>
      )}

      <div className="customer-content">

      

        <div className="customer-meta">
          <div className="meta-item">
            <span className="meta-label">name:</span>
            <span className="meta-value">{customer.crickLinks}</span>
          </div>
          {customer.createdAt && (
            <div className="meta-item">
              <span className="meta-label">Added:</span>
              <span className="meta-value">{formatDate(customer.createdAt)}</span>
            </div>
          )}
        </div>

        <div className="customer-features">
          {customer.linkTest && (
            <div className="feature-badge download">
              📥 Download
            </div>
          )}
          {customer.videoLink && (
            <div className="feature-badge video">
              🎥 Video
            </div>
          )}
          {customer.imageUrl && (
            <div className="feature-badge image">
              🖼️ Preview
            </div>
          )}
        </div>
      </div>

      <div className="card-arrow">
        →
      </div>
    </Link>
  );
}
