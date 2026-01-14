import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";
import { getAllUsers } from "../../../api/user/userApi";
import { getAllGoogleUsers } from "../../../api/auth/authApi";
import { getPendingAdmins } from "../../../api/admin/adminApi";
import { getOnlineUsersCount } from "../../../api/device/deviceApi";

const ROUTES = {
  USERS: "/UserTable",

  ADMIN_DATA: "/AdminGetAllData",
  ADMIN_MANAGE: "/AdminManageUsers",
  FIXSPEAKER: "/fix-my-speaker",
  LOGIN: "/AdminLoginPage",
  CommentApproval: "/comment-admin",
  LinkApproval: "/link-admin",
  INBOX: "/admin/messages"
};

export default function AdminHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    pendingApprovals: 0,
    serverStatus: "Online"
  });

  const fetchStats = useCallback(async () => {
    try {
      const [regularRes, googleRes, pendingRes] = await Promise.all([
        getAllUsers().catch(() => ({ data: [] })),
        getAllGoogleUsers().catch(() => ({ data: { data: [] } })),
        getPendingAdmins().catch(() => ({ data: [] }))
      ]);

      const regularData = regularRes.data || [];
      const googleData = googleRes.data?.data || googleRes.data || [];
      const pendingData = pendingRes.data || [];

      const total = regularData.length + googleData.length;

      // Live Presence Check from memory (Real-time)
      const onlineRes = await getOnlineUsersCount().catch(() => ({ data: { count: 0 } }));
      const liveOnlineCount = onlineRes.data?.count || (onlineRes.data?.data?.length) || 0;

      setStats({
        totalUsers: total,
        onlineUsers: liveOnlineCount,
        pendingApprovals: pendingData.length,
        serverStatus: "Online"
      });
    } catch (error) {
      console.error("Stats fetch error:", error);
      setStats(prev => ({ ...prev, serverStatus: "Degraded" }));
    }
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [navigate, fetchStats]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-header-premium">
        <div className="header-info">
          <h1>Admin Command Center 🛡️</h1>
          <p>Full system audit and management oversight.</p>
        </div>
        <div className="header-actions">
          <button onClick={handleLogout} className="admin-logout-btn">
            Sign Out Session
          </button>
        </div>
      </div>

      <div className="admin-stats-overview">
        <div className="admin-stat-pill">
          <span className={`pill-dot ${stats.serverStatus === "Online" ? "green" : "red"}`}></span>
          <span className="pill-label">Server:</span>
          <span className="pill-value">{stats.serverStatus}</span>
        </div>
        <div className="admin-stat-pill">
          <span className="pill-dot blue"></span>
          <span className="pill-label">Total Users:</span>
          <span className="pill-value">{stats.totalUsers}</span>
        </div>
        <div className="admin-stat-pill">
          <span className="pill-dot green"></span>
          <span className="pill-label">Online Now:</span>
          <span className="pill-value">{stats.onlineUsers}</span>
        </div>
        <div className="admin-stat-pill">
          <span className={`pill-dot ${stats.pendingApprovals > 0 ? "red" : "blue"}`}></span>
          <span className="pill-label">Alerts:</span>
          <span className="pill-value">
            {stats.pendingApprovals > 0
              ? `${stats.pendingApprovals} Pending Approvals`
              : "No Critical Issues"}
          </span>
        </div>
      </div>

      <div className="admin-sections-grid">
        {/* Identity & Access */}
        <div className="admin-category-section">
          <h2>Identity & Access</h2>
          <div className="admin-cards-grid">
            <div className="admin-card-premium" onClick={() => navigate(ROUTES.USERS)}>
              <div className="card-icon blue">👤</div>
              <div className="card-body">
                <h3>User Directory</h3>
                <p>Manage {stats.totalUsers} total registered users across all platforms.</p>
              </div>
            </div>

            <div className="admin-card-premium" onClick={() => navigate(ROUTES.ADMIN_MANAGE)}>
              <div className="card-icon purple">🛠</div>
              <div className="card-body">
                <h3>Admin Control</h3>
                <p>Manage administrative accounts and system permissions.</p>
              </div>
            </div>

            <div className="admin-card-premium" onClick={() => navigate(ROUTES.ADMIN_DATA)}>
              <div className="card-icon red">👮</div>
              <div className="card-body">
                <h3>Approval Queue</h3>
                <p>
                  {stats.pendingApprovals > 0
                    ? `Action Required: ${stats.pendingApprovals} pending requests.`
                    : "No pending registration requests."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance & Moderation */}
        <div className="admin-category-section">
          <h2>Governance</h2>
          <div className="admin-cards-grid">
            <div className="admin-card-premium" onClick={() => navigate(ROUTES.CommentApproval)}>
              <div className="card-icon yellow">💬</div>
              <div className="card-body">
                <h3>Moderation Unit</h3>
                <p>Live feed of user comments requiring review or flagging.</p>
              </div>
            </div>


            <div className="admin-card-premium" onClick={() => navigate(ROUTES.INBOX)}>
              <div className="card-icon cyan">📩</div>
              <div className="card-body">
                <h3>Inbox & Feedback</h3>
                <p>Review user messages and platform feedback responses.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
