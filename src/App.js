import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";

// Core components (always loaded)
import Header from "./myproject/Homeheader/Header/Header";
import Footer from "./myproject/Homeheader/Header/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load components for better performance
const Home = lazy(() => import("./myproject/Homeheader/Home/Home"));
const VotingSystemDescription = lazy(() => import("./myproject/Projectlistall/VotingSystemDescription"));
const Skillsdata = lazy(() => import("./myproject/Projectlistall/Skillsdata"));
const EmployeeManagementSystem = lazy(() => import("./myproject/Projectlistall/EmployeeManagementSystem"));
const PropertyInsurance = lazy(() => import("./myproject/Projectlistall/PropertyInsurance"));
const PrivacyPolicy = lazy(() => import("./myproject/Homeheader/help/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./myproject/Homeheader/help/TermsAndConditions"));
const LinksManager = lazy(() => import("./myproject/Adminpageall/Userinfo/LinksManager"));
const UserTable = lazy(() => import("./myproject/Adminpageall/Userinfo/UserTable"));
const Login = lazy(() => import("./myproject/Userdata/Login"));
const LoginEdit = lazy(() => import("./myproject/Userdata/LoginEdit"));
const UserCreatePopup = lazy(() => import("./myproject/Userdata/UserCreatePopup"));
const UserCheckForm = lazy(() => import("./myproject/Userdata/UserCheckForm"));
const UpdateUser = lazy(() => import("./myproject/Userdata/UpdateUser"));
const AdminHome = lazy(() => import("./myproject/Adminpageall/admininfo/AllAdminlinks"));
const GetAllByCategory = lazy(() => import("./myproject/Adminpageall/otherinfo/GetAllByCategory"));
const AdminLoginPage = lazy(() => import("./myproject/Adminpageall/admininfo/AdminLoginPage"));
const CreateAdminPopup = lazy(() => import("./myproject/Adminpageall/admininfo/CreateAdminPopup"));
const AdminGetAllData = lazy(() => import("./myproject/Adminpageall/admininfo/AdminGetAllData"));
const AdminManageUsers = lazy(() => import("./myproject/Adminpageall/admininfo/AdminManageUsers"));
const Helpall = lazy(() => import("./myproject/Homeheader/help/Helpall"));
const Admincrick = lazy(() => import("./myproject/Adminpageall/linkscreck/Admincrick"));
const CustomerCrickLinks = lazy(() => import("./myproject/Adminpageall/linkscreck/CustomerCrickLinks"));
const AllCustomerId = lazy(() => import("./myproject/Adminpageall/linkscreck/AllCustomerId"));
const UserDashboard = lazy(() => import("./myproject/Userdata/UserDashboard"));
const FixMySpeaker = lazy(() => import("./myproject/Adminpageall/otherinfo/FixMySpeaker"));
const Calculator = lazy(() => import("./myproject/Adminpageall/otherinfo/Calculator"));
const ColorPicker = lazy(() => import("./myproject/Adminpageall/otherinfo/ColorPicker"));
const TextTools = lazy(() => import("./myproject/Adminpageall/otherinfo/TextTools"));
const PasswordGenerator = lazy(() => import("./myproject/Adminpageall/otherinfo/PasswordGenerator"));
const TypingSpeedTest = lazy(() => import("./myproject/Adminpageall/otherinfo/TypingSpeedTest"));
const QRCodeGenerator = lazy(() => import("./myproject/Adminpageall/otherinfo/QRCodeGenerator"));
const UnitConverter = lazy(() => import("./myproject/Adminpageall/otherinfo/UnitConverter"));

function App() {
  const [loading, setLoading] = useState(true);
  const [appError, setAppError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate app initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Optional: Warm up the server
        // await fetch("https://besravan11111.onrender.com/");
        
        setLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setAppError('Failed to initialize application');
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading Application..." />;
  }

  if (appError) {
    return (
      <div className="app-error">
        <div className="error-content">
          <h2>⚠️ Application Error</h2>
          <p>{appError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          
          <main className="main-content">
            <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
              <Routes>
                {/* Home & Help Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/Helpall" element={<Helpall />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />

                {/* Project Showcase Routes */}
                <Route path="/VotingSystemDescription" element={<VotingSystemDescription />} />
                <Route path="/skills" element={<Skillsdata />} />
                <Route path="/EmployeeManagementSystem" element={<EmployeeManagementSystem />} />
                <Route path="/PropertyInsurance" element={<PropertyInsurance />} />

                {/* User Management Routes */}
                <Route path="/LinksManager" element={<LinksManager />} />
                <Route path="/UserTable" element={<UserTable />} />
                <Route path="/login" element={<Login />} />
                <Route path="/LoginEdit" element={<LoginEdit />} />
                <Route path="/UserCreatePopup" element={<UserCreatePopup />} />
                <Route path="/UserCheckForm" element={<UserCheckForm />} />
                <Route path="/UpdateUser" element={<UpdateUser />} />
                <Route path="/dashboard" element={<UserDashboard />} />

                {/* Admin Routes */}
                <Route path="/AdminHome" element={<AdminHome />} />
                <Route path="/AdminLoginPage" element={<AdminLoginPage />} />
                <Route path="/CreateAdminPopup" element={<CreateAdminPopup />} />
                <Route path="/AdminGetAllData" element={<AdminGetAllData />} />
                <Route path="/AdminManageUsers" element={<AdminManageUsers />} />
                <Route path="/GetAllByCategory" element={<GetAllByCategory />} />

                {/* Cricket Links Routes */}
                <Route path="/Admincrick" element={<Admincrick />} />
                <Route path="/crick-links" element={<CustomerCrickLinks />} />
                <Route path="/crick-links/:customerId" element={<AllCustomerId />} />

                {/* Utility Tools Routes */}
                <Route path="/fix-my-speaker" element={<FixMySpeaker />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/color-picker" element={<ColorPicker />} />
                <Route path="/text-tools" element={<TextTools />} />
                <Route path="/password-generator" element={<PasswordGenerator />} />
                <Route path="/typing-speed-test" element={<TypingSpeedTest />} />
                <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
                <Route path="/unit-converter" element={<UnitConverter />} />

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

          <Footer />
        </div>
        
        {/* Performance Monitoring */}
        <SpeedInsights />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
