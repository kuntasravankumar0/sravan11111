import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";

// Core components (always loaded)
import Header from "./myproject/Homeheader/Header/Header";
import ErrorBoundary from "./myproject/components/ErrorBoundary";
import LoadingSpinner from "./myproject/components/LoadingSpinner";

// Lazy load components for better performance
const Home = lazy(() => import("./myproject/Homeheader/Home/Home"));
const PrivacyPolicy = lazy(() => import("./myproject/Homeheader/help/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./myproject/Homeheader/help/TermsAndConditions"));

const UserTable = lazy(() => import("./myproject/Adminpageall/Userinfo/UserTable"));
const Login = lazy(() => import("./myproject/Userdata/Login"));
const LoginEdit = lazy(() => import("./myproject/Userdata/LoginEdit"));
const UserCheckForm = lazy(() => import("./myproject/Userdata/UserCheckForm"));
const UpdateUser = lazy(() => import("./myproject/Userdata/UpdateUser"));
const AdminHome = lazy(() => import("./myproject/Adminpageall/admininfo/AllAdminlinks"));
const AdminLoginPage = lazy(() => import("./myproject/Adminpageall/admininfo/AdminLoginPage"));
const AdminGetAllData = lazy(() => import("./myproject/Adminpageall/admininfo/AdminGetAllData"));
const AdminManageUsers = lazy(() => import("./myproject/Adminpageall/admininfo/AdminManageUsers"));
const Helpall = lazy(() => import("./myproject/Homeheader/help/Helpall"));

const UserDashboard = lazy(() => import("./myproject/Userdata/UserDashboard"));
const CommentApproval = lazy(() => import("./myproject/components/CommentApproval"));

const SupportPage = lazy(() => import("./myproject/pages/SupportPage"));
const FeedbackPage = lazy(() => import("./myproject/pages/FeedbackPage"));
const ContactPage = lazy(() => import("./myproject/pages/ContactPage"));
const AdminContactMessages = lazy(() => import("./myproject/pages/AdminContactMessages"));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="App">
          <Header />
          <main className="main-content">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Home Route */}
                <Route path="/" element={<Home />} />

                {/* Help & Legal Routes */}
                <Route path="/Helpall" element={<Helpall />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />

                {/* User Management Routes */}
                <Route path="/UserTable" element={<UserTable />} />
                <Route path="/login" element={<Login />} />
                <Route path="/LoginEdit" element={<LoginEdit />} />
                <Route path="/UserCheckForm" element={<UserCheckForm />} />
                <Route path="/UpdateUser" element={<UpdateUser />} />
                <Route path="/dashboard" element={<UserDashboard />} />

                {/* Admin Routes */}
                <Route path="/AdminHome" element={<AdminHome />} />
                <Route path="/AdminLoginPage" element={<AdminLoginPage />} />
                <Route path="/AdminGetAllData" element={<AdminGetAllData />} />
                <Route path="/AdminManageUsers" element={<AdminManageUsers />} />

                {/* Comment Management Routes */}
                <Route path="/comment-admin" element={<CommentApproval />} />


                {/* Additional Pages */}
                <Route path="/support" element={<SupportPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/contact-us" element={<ContactPage />} />
                <Route path="/admin/messages" element={<AdminContactMessages />} />

                {/* 404 Route */}
                <Route path="*" element={
                  <div className="not-found">
                    <h2>404 - Page Not Found</h2>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                } />
              </Routes>
            </Suspense>
          </main>
        </div>

        {/* Performance Monitoring */}
        <SpeedInsights />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
