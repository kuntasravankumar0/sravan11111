import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "./GetAllByCategory.css";
import API_BASE_URL from "../../config/apiConfig";

const LINKS_API = `${API_BASE_URL}/api/links`;

function GetAllByCategory() {
  const [category, setCategory] = useState("");
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchMode, setSearchMode] = useState("category"); // "category" or "all"
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    filtered: 0
  });

  // Fetch all data with enhanced error handling
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${LINKS_API}/all`, {
        timeout: 10000
      });

      const list = response.data?.data || response.data || [];
      setAllData(list);
      setFilteredData(list);

      // Calculate stats
      const categories = [...new Set(list.map(item => item.categary))].filter(Boolean);
      setStats({
        total: list.length,
        categories: categories.length,
        filtered: list.length
      });

    } catch (err) {
      console.error("API ERROR:", err);
      setError("❌ Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Enhanced search functionality
  const handleSearch = useCallback(() => {
    const text = category.trim().toLowerCase();
    let filtered = allData;

    if (text) {
      if (searchMode === "category") {
        filtered = allData.filter((item) =>
          (item.categary || "").toLowerCase().includes(text)
        );
      } else {
        filtered = allData.filter((item) =>
          (item.linkname || "").toLowerCase().includes(text) ||
          (item.categary || "").toLowerCase().includes(text) ||
          (item.usenote || "").toLowerCase().includes(text)
        );
      }
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.categary === selectedCategory);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
    setStats(prev => ({ ...prev, filtered: filtered.length }));
  }, [category, allData, searchMode, selectedCategory]);

  // Auto-search on input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [handleSearch]);

  // Sorting functionality
  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(allData.map(item => item.categary))].filter(Boolean);
  }, [allData]);

  const getSortIcon = useCallback((columnKey) => {
    if (sortConfig.key !== columnKey) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  }, [sortConfig]);

  const clearFilters = useCallback(() => {
    setCategory("");
    setSelectedCategory("");
    setCurrentPage(1);
    setFilteredData(allData);
    setStats(prev => ({ ...prev, filtered: allData.length }));
  }, [allData]);

  return (
    <div className="category-browser">
      <div className="header">
        <h1>Browse Links by Category</h1>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={fetchAllData}
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
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <div className="stat-number">{stats.categories}</div>
            <div className="stat-label">Categories</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <div className="stat-number">{stats.filtered}</div>
            <div className="stat-label">Filtered Results</div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="message message-error">
          {error}
          <button
            className="btn btn-sm btn-secondary"
            onClick={fetchAllData}
          >
            Retry
          </button>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="search-filter-card">
        <div className="search-controls">
          <div className="search-mode-toggle">
            <button
              className={`mode-btn ${searchMode === 'category' ? 'active' : ''}`}
              onClick={() => setSearchMode('category')}
            >
              Category Search
            </button>
            <button
              className={`mode-btn ${searchMode === 'all' ? 'active' : ''}`}
              onClick={() => setSearchMode('all')}
            >
              Global Search
            </button>
          </div>

          <div className="search-input-group">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder={
                  searchMode === 'category'
                    ? "Search by category..."
                    : "Search links, categories, notes..."
                }
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">🔍</div>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {(category || selectedCategory) && (
              <button
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Search Results ({stats.filtered})</h3>
          <div className="table-actions">
            <span className="results-info">
              Showing {paginatedData.length} of {stats.filtered} links
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <span>Loading links...</span>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No links found</h3>
            <p>
              {category || selectedCategory
                ? "Try adjusting your search criteria or clear filters"
                : "No links available in the database"
              }
            </p>
            {(category || selectedCategory) && (
              <button
                className="btn btn-primary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="links-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th
                      className="sortable"
                      onClick={() => handleSort('linkname')}
                    >
                      Link Name {getSortIcon('linkname')}
                    </th>
                    <th
                      className="sortable"
                      onClick={() => handleSort('categary')}
                    >
                      Category {getSortIcon('categary')}
                    </th>
                    <th>Use Note</th>
               
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => (
                    <tr key={item.id || item.linknumber}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                     <td>
                        <a
                          href={item.links}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-url"
                        >{item.linkname} </a></td>
                      <td>
                        <span className="category-badge">
                          {item.categary}
                        </span>
                      </td>
                      <td className="use-note">{item.usenote || '-'}</td>
                     
               
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-copy"
                            onClick={() => navigator.clipboard.writeText(item.links)}
                            title="Copy link"
                          >
                            📋
                          </button>
                          <button
                            className="btn-icon btn-share"
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: item.linkname,
                                  url: item.links
                                });
                              }
                            }}
                            title="Share link"
                          >
                            📤
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

export default GetAllByCategory;
