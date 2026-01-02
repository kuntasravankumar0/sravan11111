import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";
import "./AllCustomerId.css";

const API = `${API_BASE_URL}/api/cricklinks`;

function AllCustomerId() {
  const { customerId } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const normalizeToArray = useCallback((input) => {
    if (Array.isArray(input)) return input;
    if (input && typeof input === "object") return [input];
    return [];
  }, []);

  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API}/customer/${customerId}`, { timeout: 10000 });
      const normalizedData = normalizeToArray(res.data);
      setData(normalizedData);
    } catch (err) {
      console.error("Fetch customer data error:", err);
      setError("Failed to load customer data. Please try again.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [customerId, normalizeToArray]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="customer-detail-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Loading customer data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-detail-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={fetchCustomerData}>
              Try Again
            </button>
            <Link to="/crick-links" className="btn btn-secondary">
              ← Back to Links
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="customer-detail-container">
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No Data Found</h3>
          <p>No records found for customer ID: {customerId}</p>
          <Link to="/crick-links" className="btn btn-primary">
            ← Back to Links
          </Link>
        </div>
      </div>
    );
  }

  const record = data[0]; // Get the first record

  return (
    <div className="customer-detail-container">
      {/* Header */}
      <div className="detail-header">
        <div className="header-content">
          <Link to="/crick-links" className="back-link">
            ← Back to Drive Links
          </Link>
          <h1>{record.crickLinks}</h1>
          <div className="header-meta">
        
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📋 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          📄 Details
        </button>
        {record.videoLink && (
          <button 
            className={`tab-button ${activeTab === "media" ? "active" : ""}`}
            onClick={() => setActiveTab("media")}
          >
            🎥 Media
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <OverviewTab record={record} formatDate={formatDate} />
        )}
        {activeTab === "details" && (
          <DetailsTab record={record} />
        )}
        {activeTab === "media" && record.videoLink && (
          <MediaTab record={record} />
        )}
      </div>
    </div>
  );
}

/* Overview Tab Component */
function OverviewTab({ record, formatDate }) {
  return (
    <div className="overview-content">
      <div className="overview-grid">
        {/* Main Info Card */}
        <div className="info-card main-info">
          <div className="card-header">
            <h3>Software Information</h3>
          </div>
          <div className="card-content">
            {record.imageUrl && (
              <div className="software-image">
                <img src={record.imageUrl} alt="Software preview" />
              </div>
            )}
            <div className="software-details">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{record.crickLinks}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Customer ID:</span>
                <span className="detail-value">{record.customerId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Record ID:</span>
                <span className="detail-value">#{record.id}</span>
              </div>
              {record.createdAt && (
                <div className="detail-item">
                  <span className="detail-label">Added:</span>
                  <span className="detail-value">{formatDate(record.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="info-card actions-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="action-buttons">
              {record.linkTest && (
                <a
                  href={record.linkTest}
                  target="_blank"
                  rel="noreferrer"
                  className="action-btn download"
                >
                  <span className="btn-icon">📥</span>
                  <span className="btn-text">Download Software</span>
                  <span className="btn-arrow">→</span>
                </a>
              )}
              {record.videoLink && (
                <button
                  className="action-btn video"
                  onClick={() => window.open(record.videoLink, '_blank')}
                >
                  <span className="btn-icon">🎥</span>
                  <span className="btn-text">Watch Video</span>
                  <span className="btn-arrow">→</span>
                </button>
              )}
              <button
                className="action-btn share"
                onClick={() => navigator.share ? navigator.share({
                  title: record.crickLinks,
                  url: window.location.href
                }) : navigator.clipboard.writeText(window.location.href)}
              >
                <span className="btn-icon">📤</span>
                <span className="btn-text">Share Link</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      {record.aboutSoftware && (
        <div className="info-card description-card">
          <div className="card-header">
            <h3>About This Software</h3>
          </div>
          <div className="card-content">
            <p className="description-text">{record.aboutSoftware}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* Details Tab Component */
function DetailsTab({ record }) {
  return (
    <div className="details-content">
      <div className="details-grid">
        {/* Command Setup */}
        {record.cmdCommandSetup && (
          <div className="info-card command-card">
            <div className="card-header">
              <h3>🖥️ Command Setup</h3>
            </div>
            <div className="card-content">
              <div className="command-wrapper">
                <pre className="command-box">{record.cmdCommandSetup}</pre>
                <button 
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(record.cmdCommandSetup)}
                >
                  📋 Copy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Technical Details */}
        <div className="info-card technical-card">
          <div className="card-header">
            <h3>🔧 Technical Details</h3>
          </div>
          <div className="card-content">
            <div className="technical-grid">
              <div className="tech-item">
                <span className="tech-label">Software Name:</span>
                <span className="tech-value">{record.crickLinks}</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Customer ID:</span>
                <span className="tech-value">{record.customerId}</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Record ID:</span>
                <span className="tech-value">#{record.id}</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Download Available:</span>
                <span className="tech-value">{record.linkTest ? '✅ Yes' : '❌ No'}</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Video Tutorial:</span>
                <span className="tech-value">{record.videoLink ? '✅ Available' : '❌ Not Available'}</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Preview Image:</span>
                <span className="tech-value">{record.imageUrl ? '✅ Available' : '❌ Not Available'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Media Tab Component */
function MediaTab({ record }) {
  return (
    <div className="media-content">
      <div className="media-grid">
        {/* Video Player */}
        {record.videoLink && (
          <div className="info-card video-card">
            <div className="card-header">
              <h3>🎥 Video Tutorial</h3>
            </div>
            <div className="card-content">
              <VideoPlayer videoUrl={record.videoLink} />
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {record.imageUrl && (
          <div className="info-card image-card">
            <div className="card-header">
              <h3>🖼️ Software Preview</h3>
            </div>
            <div className="card-content">
              <div className="image-gallery">
                <img 
                  src={record.imageUrl} 
                  alt="Software preview" 
                  className="gallery-image"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Video Player Component */
function VideoPlayer({ videoUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getVideoInfo = (url) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return {
        platform: 'youtube',
        id: youtubeMatch[1],
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`
      };
    }

    // Mega.nz
    if (url.includes('mega.nz/embed/') || url.includes('mega.co.nz/embed/')) {
      return {
        platform: 'mega',
        embedUrl: url
      };
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return {
        platform: 'vimeo',
        id: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
      };
    }

    return {
      platform: 'unknown',
      embedUrl: url
    };
  };

  const videoInfo = getVideoInfo(videoUrl);

  return (
    <div className="video-player-container">
      {!isPlaying ? (
        <div className="video-thumbnail" onClick={() => setIsPlaying(true)}>
          <div className="video-placeholder">
            <div className="play-button">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <div className="video-info">
              <h4>Click to Play Video</h4>
              <p>Platform: {videoInfo.platform.toUpperCase()}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="video-embed-wrapper">
          <iframe
            width="100%"
            height="400"
            src={videoInfo.embedUrl}
            title="Video Player"
            style={{ border: 'none' }}
            allowFullScreen
          ></iframe>
          <button 
            className="close-video"
            onClick={() => setIsPlaying(false)}
          >
            ✖️ Close Video
          </button>
        </div>
      )}
    </div>
  );
}

export default AllCustomerId;
