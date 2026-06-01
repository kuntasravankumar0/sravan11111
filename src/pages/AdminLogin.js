import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { adminService } from '../config/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminService.login({ email, password });
      if (res.data?.status) {
        loginAdmin(res.data.admin);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div
          className="auth-card glass-strong"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-header">
            <div className="admin-icon-wrap">
              <Shield size={32} />
            </div>
            <h2>Admin Access</h2>
            <p>Sign in to the admin dashboard</p>
          </div>

          {error && (
            <motion.div
              className="auth-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
