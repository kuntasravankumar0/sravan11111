import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/templates', label: 'Projects' },
  { path: '/tools', label: 'Tools' },
  { path: '/contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <motion.header
      className={`premium-header ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <motion.div
            className="logo-mark"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="logo-gradient">S</span>
          </motion.div>
          <span className="logo-text">Sravan</span>
        </Link>

        <nav className="header-nav desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div className="nav-indicator" layoutId="nav-indicator" />
              )}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className={`nav-item ${location.pathname.startsWith('/admin/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="header-actions">
          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <Link to={isAdmin ? '/admin/dashboard' : '/login'} className="btn-primary header-cta">
            {isAdmin ? 'Dashboard' : 'Sign In'}
          </Link>

          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu glass-strong"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={link.path} className="mobile-nav-item">
                  {link.label}
                </Link>
              </motion.div>
            ))}
            {isAdmin && (
              <Link to="/admin/dashboard" className="mobile-nav-item">
                Dashboard
              </Link>
            )}
            <Link to={isAdmin ? '/admin/dashboard' : '/login'} className="btn-primary mobile-cta">
              {isAdmin ? 'Dashboard' : 'Sign In'}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
