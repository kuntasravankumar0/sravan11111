import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      <style>{`
        .admin-card {
          width: 260px;
          padding: 25px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
          text-align: center;
          cursor: pointer;
          transition: 0.2s;
        }
        .admin-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        }
        .admin-title {
          font-size: 28px;
          text-align: center;
          margin-bottom: 25px;
          color: #34495e;
        }
      `}</style>

      <h1 className="admin-title">Admin Dashboard</h1>

      <div style={styles.grid}>

        {/* USERS PAGE BUTTON */}
        <div className="admin-card" onClick={() => navigate("/UserTable")}>
          <h3>👤 Manage Users</h3>
          <p>View, Edit & Delete Users</p>
        </div>

        {/* LINKS MANAGER */}
        <div className="admin-card" onClick={() => navigate("/LinksManager")}>
          <h3>🔗 Manage Links</h3>
          <p>Add, Update, Delete Links</p>
        </div>

        {/* CATEGORY VIEW */}
        <div className="admin-card" onClick={() => navigate("/GetAllByCategory")}>
          <h3>📂 test links</h3>
          <p>Filter Links by Category</p>
        </div>


           {/* CATEGORY VIEW */}
        <div className="admin-card" onClick={() => navigate("/AdminGetAllData")}>
          <h3>📂  admin user</h3>
          <p>see all admin data</p>
        </div>

             {/* CATEGORY VIEW */}
        <div className="admin-card" onClick={() => navigate("/AdminManageUsers")}>
          <h3>📂 admin edits</h3>
          <p>admin data handle </p>
        </div>

        {/* ADD MORE ADMIN FEATURES */}
        <div className="admin-card" onClick={() => alert("Coming Soon!")}>
          <h3>⚙️ Settings</h3>
          <p>More admin tools will come here</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "Poppins, sans-serif",
    background: "#f4f6f9"
  },
  grid: {
    display: "flex",
    gap: "25px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "20px"
  }
};
