import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 700, opacity: 0.1, marginBottom: '-20px' }}>
          404
        </h1>
        <h2 style={{ marginBottom: '12px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-tertiary)', marginBottom: '32px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          <Home size={18} /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
