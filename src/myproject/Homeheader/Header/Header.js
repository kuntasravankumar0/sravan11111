import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { pingPresence } from "../../../api/device/deviceApi";

function Header() {
  const [headerUser, setHeaderUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 🔹 Read user info for header (Google or Normal)
  useEffect(() => {
    const storedUser = localStorage.getItem("headerUser");
    const googleUser = localStorage.getItem("googleUser");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setHeaderUser(user);
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    } else if (googleUser) {
      try {
        const user = JSON.parse(googleUser);
        setHeaderUser({
          name: user.name,
          email: user.email,
          image: user.picture || user.image
        });
      } catch (error) {
        console.error("Error parsing Google user:", error);
      }
    }
  }, []);

  // 🔹 Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔹 Heartbeat: Update presence and GPS every 20 seconds
  useEffect(() => {
    const sendPingAction = async () => {
      const googleUserStr = localStorage.getItem("googleUser");
      const headerUserStr = localStorage.getItem("headerUser");

      if (!headerUserStr && !googleUserStr) return;

      try {
        const hUser = headerUserStr ? JSON.parse(headerUserStr) : {};
        const gUser = googleUserStr ? JSON.parse(googleUserStr) : null;

        // Get current location
        let coords = { lat: 0, lng: 0 };
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0
            });
          });
          coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        } catch (geoErr) {
          console.warn("Geolocation denied or timed out");
          // Fallback to existing user coordinates if available
          coords = {
            lat: hUser.latitude || gUser?.latitude || 0,
            lng: hUser.longitude || gUser?.longitude || 0
          };
        }

        const payload = {
          userId: gUser ? String(gUser.googleId) : String(hUser.number || localStorage.getItem("userNumber") || ""),
          authProvider: gUser ? "GOOGLE" : "MANUAL",
          latitude: coords.lat,
          longitude: coords.lng,
          deviceInfo: navigator.userAgent
        };

        if (payload.userId && payload.userId !== "") {
          await pingPresence(payload);
        }
      } catch (err) {
        console.warn("Presence ping failed:", err.message);
      }
    };

    sendPingAction();
    const interval = setInterval(sendPingAction, 20000); // Send every 20s
    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div>
      <header className={`header-navigation-bar-container ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content-wrapper">
          <div className="site-owner-name-display-section">
            <Link to="/" className="logo-link">
              {headerUser ? (
                <div className="header-user-info">
                  {headerUser.image ? (
                    <>
                      <img
                        src={headerUser.image}
                        alt="User Profile"
                        className="header-user-avatar"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentNode.querySelector('.header-user-fallback');
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                        loading="lazy"
                      />
                      <div className="header-user-fallback" style={{
                        display: 'none',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#4f46e5',
                        color: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        {headerUser.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </>
                  ) : (
                    <div className="header-user-fallback" style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}>
                      {headerUser.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="user-details">
                    <div className="header-user-name">{headerUser.name}</div>
                    <div className="header-user-email">{headerUser.email}</div>
                  </div>
                </div>
              ) : (
                <div className="brand-logo">
                  <span className="brand-name">Welcome</span>
                  <span className="brand-tagline">user</span>
                </div>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >📲
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <nav className={`navigation-menu-items-wrapper ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">🏠</span>
              Home
            </Link>

            <Link to="/UserCheckForm" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">🔑</span>
              Login
            </Link>

            <Link to="/AdminLoginPage" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">🛡️</span>
              Admin
            </Link>

            <div className="social-links">
              <a
                href="https://sravan11111.wordpress.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="WordPress Blog"
              >
                <span className="social-icon">📝</span>
              </a>

            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default Header;
