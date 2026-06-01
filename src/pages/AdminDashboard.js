import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Shield, MessageSquare, Mail, Activity, LogOut,
  CheckCircle, XCircle, Trash2, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService, adminService, commentService, contactService, presenceService, googleService } from '../config/api';
import './AdminDashboard.css';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'admins', label: 'Admins', icon: Shield },
  { id: 'comments', label: 'Comments', icon: MessageSquare },
  { id: 'messages', label: 'Messages', icon: Mail },
];

export default function AdminDashboard() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, online: 0, pending: 0, comments: 0, messages: 0 });
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);

  const fetchStats = useCallback(async () => {
    try {
      const [usersRes, googleRes, onlineRes, pendingRes, commentsRes, messagesRes] = await Promise.all([
        userService.getAll().catch(() => ({ data: [] })),
        googleService.getAll().catch(() => ({ data: { data: [] } })),
        presenceService.getCount().catch(() => ({ data: { count: 0 } })),
        adminService.getPending().catch(() => ({ data: [] })),
        commentService.getPending().catch(() => ({ data: [] })),
        contactService.getAll().catch(() => ({ data: { data: [] } })),
      ]);

      const allUsers = [...(usersRes.data || []), ...(googleRes.data?.data || [])];
      setUsers(allUsers);
      setComments(commentsRes.data || []);
      setMessages(messagesRes.data?.data || messagesRes.data || []);

      setStats({
        users: allUsers.length,
        online: onlineRes.data?.count || 0,
        pending: (pendingRes.data || []).length,
        comments: (commentsRes.data || []).length,
        messages: (messagesRes.data?.data || messagesRes.data || []).length,
      });
    } catch (err) {
      console.error('Stats error:', err);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) { navigate('/admin/login'); return; }
    fetchStats();
  }, [isAdmin, navigate, fetchStats]);

  const handleApproveComment = async (id) => {
    await commentService.approve(id);
    setComments(comments.filter(c => c.id !== id));
    setStats(s => ({ ...s, comments: s.comments - 1 }));
  };

  const handleRejectComment = async (id) => {
    await commentService.reject(id);
    setComments(comments.filter(c => c.id !== id));
    setStats(s => ({ ...s, comments: s.comments - 1 }));
  };

  const handleDeleteMessage = async (id) => {
    await contactService.delete(id);
    setMessages(messages.filter(m => m.id !== id));
    setStats(s => ({ ...s, messages: s.messages - 1 }));
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar glass-strong">
        <div className="sidebar-header">
          <Shield size={20} />
          <span>Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
              {tab.id === 'comments' && stats.comments > 0 && (
                <span className="badge">{stats.comments}</span>
              )}
            </button>
          ))}
        </nav>
        <button className="sidebar-item logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card glass">
                <Users size={24} />
                <div><span className="stat-value">{stats.users}</span><span className="stat-label">Total Users</span></div>
              </div>
              <div className="stat-card glass">
                <Activity size={24} />
                <div><span className="stat-value">{stats.online}</span><span className="stat-label">Online Now</span></div>
              </div>
              <div className="stat-card glass">
                <MessageSquare size={24} />
                <div><span className="stat-value">{stats.comments}</span><span className="stat-label">Pending Comments</span></div>
              </div>
              <div className="stat-card glass">
                <Mail size={24} />
                <div><span className="stat-value">{stats.messages}</span><span className="stat-label">Messages</span></div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>All Users ({users.length})</h2>
            <div className="data-table">
              <div className="table-header">
                <span>Name</span><span>Email</span><span>Provider</span><span>Status</span>
              </div>
              {users.map((u) => (
                <div key={u.id + (u.googleId || '')} className="table-row">
                  <span>{u.username || u.name || '—'}</span>
                  <span>{u.useremail || u.email || '—'}</span>
                  <span className="provider-badge">{u.authProvider || u.googleId ? 'GOOGLE' : 'MANUAL'}</span>
                  <span className={`status-dot ${u.status === 'ONLINE' ? 'online' : 'offline'}`}>{u.status || 'OFFLINE'}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'admins' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Admin Management</h2>
            <p style={{ color: 'var(--text-tertiary)' }}>Pending admin approvals: {stats.pending}</p>
          </motion.div>
        )}

        {activeTab === 'comments' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Pending Comments ({comments.length})</h2>
            {comments.length === 0 ? (
              <div className="empty-state"><CheckCircle size={40} /><p>All caught up!</p></div>
            ) : (
              <div className="cards-list">
                {comments.map((c) => (
                  <div key={c.id} className="moderation-card glass">
                    <div className="mod-content">
                      <strong>{c.name}</strong>
                      <p>{c.content}</p>
                      <span className="mod-time"><Clock size={12} /> {new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mod-actions">
                      <button className="action-btn approve" onClick={() => handleApproveComment(c.id)}>
                        <CheckCircle size={16} />
                      </button>
                      <button className="action-btn reject" onClick={() => handleRejectComment(c.id)}>
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Contact Messages ({messages.length})</h2>
            <div className="cards-list">
              {messages.map((m) => (
                <div key={m.id} className="moderation-card glass">
                  <div className="mod-content">
                    <strong>{m.name}</strong> <span className="mod-email">{m.email}</span>
                    <p>{m.message}</p>
                    <span className="mod-time"><Clock size={12} /> {new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mod-actions">
                    <button className="action-btn reject" onClick={() => handleDeleteMessage(m.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
