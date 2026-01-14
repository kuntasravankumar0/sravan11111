import React from 'react';
import "./BottomPart.css";

const BottomPart = () => {
  return (
    <section className="bottom-part">
      <div className="bottom-background">
        <div className="bottom-pattern"></div>
      </div>

      <div className="bottom-container">
        <div className="bottom-main">
          <div className="bottom-section about-section">
            <div className="brand-logo">
              <div className="logo-icon">
                <span>K</span>
              </div>
              <div className="logo-text">
                <p className="tagline">Full Stack Developer</p>
              </div>
            </div>
            <p className="about-description">
              Building innovative web solutions with modern technologies.
              Passionate about creating scalable, user-friendly applications
              that make a difference.
            </p>
            <div className="social-links">
              <a
                href="https://www.instagram.com/ksravankumar0/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link instagram"
                title="Follow on Instagram"
              >
                <i className="fab fa-instagram"></i>
                <span>📷</span>
              </a>insta
              <a
                href="https://www.youtube.com/@sravan11111"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link youtube"
                title="Subscribe on YouTube"
              >
                <i className="fab fa-youtube"></i>
                <span>📺</span>
              </a>youtube
              <a
                href="https://github.com/sravan11111"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link github"
                title="Follow on GitHub"
              >
                <i className="fab fa-github"></i>
                <span>💻</span>
              </a>
            </div>
          </div>

          <div className="bottom-section quick-links-section">
            <h4>
              <span className="section-icon">🔗</span>
              Quick Links
            </h4>
            <ul className="quick-links">
              <li>
                <a href="/privacy-policy">
                  <span className="link-icon">🔒</span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms">
                  <span className="link-icon">📋</span>
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/helpall">
                  <span className="link-icon">❓</span>
                  Help & Support
                </a>
              </li>

            </ul>
          </div>

          <div className="bottom-section newsletter-section">
            <h4>
              <span className="section-icon">📬</span>
              Stay Connected
            </h4>

            <a className="link-icon" href="/feedback">Feedback</a><br /><br />
            <a className="link-icon" href="/support">Support</a><br /><br />
            <a className="link-icon" href="/contact-us">Contact Us</a><br /><br />
            <p className="newsletter-description">
              Get updates about new tools, projects, and tech insights.
            </p>
            <div className="newsletter-form">
              <div className="input-group">
              </div>
            </div>
            <div className="contact-info">
              <div className="contact-item">
              </div>
              <div className="contact-item">
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-credits">
          <div className="credits-content">
            <div className="copyright">
              <span>© {new Date().getFullYear()} hi user. All rights reserved.</span>
            </div>
            <div className="credits-links">
              <span className="made-with">
                Made with <span className="heart">❤️</span> using React & Spring Boot
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomPart;