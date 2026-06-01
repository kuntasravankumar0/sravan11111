import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="premium-footer">
      <div className="footer-glow" />
      <div className="container">
        <motion.div
          className="footer-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-mark">
                <span className="logo-gradient">S</span>
              </div>
              <span className="logo-text">Sravan Platform</span>
            </div>
            <p className="footer-tagline">
              A premium digital platform built with modern engineering and elegant design.
            </p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>Platform</h4>
              <Link to="/">Home</Link>
              <Link to="/templates">Projects</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-col">
              <h4>Account</h4>
              <Link to="/login">Sign In</Link>
              <Link to="/admin/login">Admin</Link>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="mailto:contact@sravan.dev">Email</a>
            </div>
          </div>
        </motion.div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sravan. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span>Built with React & Spring Boot</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
