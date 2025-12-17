import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ROUTES = {
  USERS: "/UserTable",
  LINKS: "/LinksManager",
  CATEGORY: "/GetAllByCategory",
  ADMIN_DATA: "/AdminGetAllData",
  ADMIN_MANAGE: "/AdminManageUsers",
    Admincrick:"/Admincrick",

};

export default function AdminHome() {
  const navigate = useNavigate();

  // ---------- BASIC ACCESS GUARD ----------
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [navigate]);

  

  return (
    <div style={styles.page}>
      {/* INLINE CSS (kept minimal) */}
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
        <div className="admin-card" onClick={() => navigate(ROUTES.USERS)}>
          <h3>👤 Manage Users</h3>
          <p>View, Edit & Delete Users</p>
        </div>

        <div className="admin-card" onClick={() => navigate(ROUTES.LINKS)}>
          <h3>🔗 Manage Links</h3>
          <p>Add, Update, Delete Links</p>
        </div>

        <div className="admin-card" onClick={() => navigate(ROUTES.CATEGORY)}>
          <h3>📂 View Links</h3>
          <p>Filter Links by Category</p>
        </div>

        <div className="admin-card" onClick={() => navigate(ROUTES.ADMIN_DATA)}>
          <h3>👮 Admin Approvals</h3>
          <p>View admin requests</p>
        </div>

        <div className="admin-card" onClick={() => navigate(ROUTES.ADMIN_MANAGE)}>
          <h3>🛠 Admin Management</h3>
          <p>Edit & control admin data</p>
        </div>
           <div className="admin-card" onClick={() => navigate(ROUTES.Admincrick)}>
          <h3>free software links</h3>
          <p>free to download</p>
        </div>

        <div
          className="admin-card"
        >
          <h3>⚙️ Add Soon</h3>
          <p>Advanced admin tools</p>
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
    background: "#f4f6f9",
    position: "relative",
  },
  grid: {
    display: "flex",
    gap: "25px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "20px",
  },
};
