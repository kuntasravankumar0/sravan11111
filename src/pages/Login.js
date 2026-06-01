import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowRight, User } from 'lucide-react';
import { userService } from '../config/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [mode, setMode] = useState('check'); // check, create
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await userService.check(email, number);
      const data = res.data;
      if (data.type === 'both') {
        loginUser(data.data);
        navigate('/');
      } else if (data.type === 'none') {
        setMode('create');
        setMessage('No account found. Create one below.');
      } else {
        setMessage('Partial match found. Please verify your credentials.');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error checking user.');
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await userService.create({ username, useremail: email, number: parseInt(number) });
      if (res.data?.status) {
        loginUser(res.data.data);
        navigate('/');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating account.');
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
            <h2>{mode === 'check' ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{mode === 'check' ? 'Sign in to your account' : 'Set up your new account'}</p>
          </div>

          {message && (
            <motion.div
              className="auth-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message}
            </motion.div>
          )}

          <form onSubmit={mode === 'check' ? handleCheck : handleCreate}>
            {mode === 'create' && (
              <div className="input-group">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Phone size={18} className="input-icon" />
              <input
                type="number"
                placeholder="Phone number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Processing...' : mode === 'check' ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer">
            {mode === 'check' ? (
              <p>Don't have an account? <button onClick={() => setMode('create')}>Create one</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setMode('check')}>Sign in</button></p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
