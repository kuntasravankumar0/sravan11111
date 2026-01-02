import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import MoreOptions from "./MoreOptions";

function Header() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeContent, setActiveContent] = useState("");
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
                  {headerUser.image && (
                    <img
                      src={headerUser.image}
                      alt="User Profile"
                      className="header-user-avatar"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                      loading="lazy"
                    />
                  )}
                  <div className="user-details">
                    <div className="header-user-name">{headerUser.name}</div>
                    <div className="header-user-email">{headerUser.email}</div>
                  </div>
                </div>
              ) : (
                <div className="brand-logo">
                  <span className="brand-name">K Sravan</span>
                  <span className="brand-tagline">Developer & Creator</span>
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

            <Link to="/skills" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">👨‍💻</span>
              About
            </Link>

            <button
              type="button"
              className="nav-link-button"
              onClick={() => {
                setActiveContent("projects");
                setIsPopupVisible(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <span className="nav-icon">🚀</span>
              Projects
            </button>

            <button
              type="button"
              className="nav-link-button"
              onClick={() => {
                setActiveContent("tools");
                setIsPopupVisible(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <span className="nav-icon">🛠️</span>
              Tools
            </button>

            <button
              type="button"
              className="nav-link-button"
              onClick={() => {
                setActiveContent("more");
                setIsPopupVisible(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <span className="nav-icon">⚡</span>
              More
            </button>

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

      {isPopupVisible && (
        <div
          className="popup-overlay-display-container"
          
          onClick={(e) => {
            if (
              e.target.classList.contains(
                "popup-overlay-display-container"
              )
            ) {
              setIsPopupVisible(false);
            }
          }}
        >
          <div className="popup-content-wrapper-container">
            <span
              className="popup-close-button-unique"
              onClick={() => setIsPopupVisible(false)}
            >
              &times;
            </span>

            {activeContent === "projects" && (
              <div id="projectsContent">
                <div className="popup-header">
                  <h1>🚀 My Projects</h1>
                  <p>Explore my latest work and creations</p>
                </div>

                <div className="projects-grid-display-container">
                  <div className="project-card-display-container">
                    <div className="project-info-section-wrapper">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPn-ZA8WXbPR7wl9r8DimTX9SzQq9q7jnH9w&s"
                        alt="Employee"
                        className="project-image-style-wrapper"
                      />
                      <div>
                        <h3 className="project-title-header-style">
                          Employee Management
                        </h3>
                        <p className="project-description-text-style">
                          Complete employee management system with CRUD operations
                        </p>
                        <div className="project-tags">
                          <span className="tag">React</span>
                          <span className="tag">Spring Boot</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/EmployeeManagementSystem"
                      className="project-button-link-style"
                      onClick={() => setIsPopupVisible(false)}
                    >
                      View Project →
                    </Link>
                  </div>

                  <div className="project-card-display-container">
                    <div className="project-info-section-wrapper">
                      <img
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop"
                        alt="Property"
                        className="project-image-style-wrapper"
                      />
                      <div>
                        <h3 className="project-title-header-style">
                          Property Insurance
                        </h3>
                        <p className="project-description-text-style">
                          Insurance management system for property protection
                        </p>
                        <div className="project-tags">
                          <span className="tag">React</span>
                          <span className="tag">API</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/PropertyInsurance"
                      className="project-button-link-style"
                      onClick={() => setIsPopupVisible(false)}
                    >
                      View Project →
                    </Link>
                  </div>

                  <div className="project-card-display-container">
                    <div className="project-info-section-wrapper">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgjve_pIggmZNqYSwXYm_L-pbDQx7ZSgtypg&s"
                        alt="Vote"
                        className="project-image-style-wrapper"
                      />
                      <div>
                        <h3 className="project-title-header-style">
                          Online Voting System
                        </h3>
                        <p className="project-description-text-style">
                          Secure digital voting platform with real-time results
                        </p>
                        <div className="project-tags">
                          <span className="tag">React</span>
                          <span className="tag">Security</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/VotingSystemDescription"
                      className="project-button-link-style"
                      onClick={() => setIsPopupVisible(false)}
                    >
                      View Project →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeContent === "tools" && (
              <div id="toolsContent">
                <div className="popup-header">
                  <h1>🛠️ Useful Tools</h1>
                  <p>Handy utilities and tools for everyday use</p>
                </div>

                <div className="tools-grid-display-container">
                  <div className="tool-card-display-container">
                    <div className="tool-info-section-wrapper">
                      <div className="tool-icon">🔧</div>
                      <div>
                        <h3 className="tool-title-header-style">Fix My Speaker</h3>
                        <p className="tool-description-text-style">
                          Clean your phone speakers with sound waves
                        </p>
                      </div>
                    </div>
                    <Link to="/fix-my-speaker" className="tool-button-link-style" onClick={() => setIsPopupVisible(false)}>
                      Use Tool →
                    </Link>
                  </div>

                  <div className="tool-card-display-container">
                    <div className="tool-info-section-wrapper">
                      <div className="tool-icon">🧮</div>
                      <div>
                        <h3 className="tool-title-header-style">Calculator</h3>
                        <p className="tool-description-text-style">
                          Advanced calculator with scientific functions
                        </p>
                      </div>
                    </div>
                    <Link to="/calculator" className="tool-button-link-style" onClick={() => setIsPopupVisible(false)}>
                      Use Tool →
                    </Link>
                  </div>

                  <div className="tool-card-display-container">
                    <div className="tool-info-section-wrapper">
                      <div className="tool-icon">🎨</div>
                      <div>
                        <h3 className="tool-title-header-style">Color Picker</h3>
                        <p className="tool-description-text-style">
                          Pick and generate color palettes for your projects
                        </p>
                      </div>
                    </div>
                    <Link to="/color-picker" className="tool-button-link-style" onClick={() => setIsPopupVisible(false)}>
                      Use Tool →
                    </Link>
                  </div>

                  <div className="tool-card-display-container">
                    <div className="tool-info-section-wrapper">
                      <div className="tool-icon">📝</div>
                      <div>
                        <h3 className="tool-title-header-style">Text Tools</h3>
                        <p className="tool-description-text-style">
                          Text manipulation, word count, and formatting tools
                        </p>
                      </div>
                    </div>
                    <Link to="/text-tools" className="tool-button-link-style" onClick={() => setIsPopupVisible(false)}>
                      Use Tool →
                    </Link>
                  </div>

                  <div className="tool-card-display-container">
                    <div className="tool-info-section-wrapper">
                      <div className="tool-icon">🔐</div>
                      <div>
                        <h3 className="tool-title-header-style">Password Generator</h3>
                        <p className="tool-description-text-style">
                          Generate secure passwords with custom options
                        </p>
                      </div>
                    </div>
                    <Link to="/password-generator" className="tool-button-link-style" onClick={() => setIsPopupVisible(false)}>
                      Use Tool →
                    </Link>
                  </div>

                  <div className="tool-card-display-container">
                    <div className="tool-info-section-wrapper">
                      <div className="tool-icon">⌨️</div>
                      <div>
                        <h3 className="tool-title-header-style">Typing Speed Test</h3>
                        <p className="tool-description-text-style">
                          Test your typing speed and accuracy with WPM tracking
                        </p>
                      </div>
                    </div>
                    <Link to="/typing-speed-test" className="tool-button-link-style" onClick={() => setIsPopupVisible(false)}>
                      Use Tool →
                    </Link>
                  </div>

                  <div className="tool-card-display-container">
                    <div className="tool-info-section-wrapper">
                      <div className="tool-icon">🔲</div>
                      <div>
                        <h3 className="tool-title-header-style">QR Code Generator</h3>
                        <p className="tool-description-text-style">
                          Generate QR codes for text, URLs, and batch processing
                        </p>
                      </div>
                    </div>
                    <Link to="/qr-code-generator" className="tool-button-link-style" onClick={() => setIsPopupVisible(false)}>
                      Use Tool →
                    </Link>
                  </div>

                  <div className="tool-card-display-container">
                    <div className="tool-info-section-wrapper">
                      <div className="tool-icon">⚖️</div>
                      <div>
                        <h3 className="tool-title-header-style">Unit Converter</h3>
                        <p className="tool-description-text-style">
                          Convert units including electrical, energy, and pressure
                        </p>
                      </div>
                    </div>
                    <Link to="/unit-converter" className="tool-button-link-style" onClick={() => setIsPopupVisible(false)}>
                      Use Tool →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeContent === "more" && <MoreOptions />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
