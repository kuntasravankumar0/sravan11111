import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./myproject/Homeheader/Header/Header";
import Home from "./myproject/Homeheader/Home/Home";
import Footer from "./myproject/Homeheader/Header/Footer";
import VotingSystemDescription from "./myproject/Projectlistall/VotingSystemDescription";
import Skillsdata from "./myproject/Projectlistall/Skillsdata";
import EmployeeManagementSystem from "./myproject/Projectlistall/EmployeeManagementSystem";
import PropertyInsurance from "./myproject/Projectlistall/PropertyInsurance";
import PrivacyPolicy from "./myproject/Homeheader/help/PrivacyPolicy";
import TermsAndConditions from "./myproject/Homeheader/help/TermsAndConditions" 
import LinksManager from "./myproject/Adminpageall/Userinfo/LinksManager";
import UserTable from "./myproject/Adminpageall/Userinfo/UserTable";
import Login from "./myproject/Userdata/Login"
import LoginEdit from "./myproject/Userdata/LoginEdit"
import UserCreatePopup from "./myproject/Userdata/UserCreatePopup"
import UserCheckForm from "./myproject/Userdata/UserCheckForm"
import UpdateUser from "./myproject/Userdata/UpdateUser"
import AdminHome from "./myproject/Adminpageall/admininfo/AllAdminlinks";
import GetAllByCategory from "./myproject/Adminpageall/otherinfo/GetAllByCategory"
import AdminLoginPage from "./myproject/Adminpageall/admininfo/AdminLoginPage"
import CreateAdminPopup from "./myproject/Adminpageall/admininfo/CreateAdminPopup";
import AdminGetAllData from "./myproject/Adminpageall/admininfo/AdminGetAllData";
import AdminManageUsers from "./myproject/Adminpageall/admininfo/AdminManageUsers";
import Helpall from "./myproject/Homeheader/help/Helpall";
import { useEffect, useState } from "react";
import Admincrick from "./myproject/Adminpageall/linkscreck/Admincrick";
import CustomerCrickLinks from "./myproject/Adminpageall/linkscreck/CustomerCrickLinks";
import AllCustomerId from "./myproject/Adminpageall/linkscreck/AllCustomerId";
import UserDashboard from "./myproject/Userdata/UserDashboard";
function App() {



  const [loading, setLoading] = useState(true);

useEffect(() => {
  setTimeout(() => {
    setLoading(false);
    // fetch("https://besravan11111.onrender.com/");
  }, );
}, []);


  if (loading) {
    return (
      <div className="global-loader">
        <div className="global-spinner"></div>
      </div>
    );
  }







  return (
    
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Helpall" element={<Helpall />} />
         <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />

        <Route path="/VotingSystemDescription" element={<VotingSystemDescription />} />
        <Route path="/skills" element={<Skillsdata />} />
        <Route path="/EmployeeManagementSystem" element={<EmployeeManagementSystem />} />
        <Route path="/PropertyInsurance" element={<PropertyInsurance />} />

        <Route path="/LinksManager" element={<LinksManager />} />
        <Route path="/UserTable" element={<UserTable />} />

        <Route path="/login" element={<Login />} />
        <Route path="/LoginEdit" element={<LoginEdit />} />   {/* ✔ FIXED */}
          <Route path="/GetAllByCategory" element={<GetAllByCategory />} />
        <Route path="/UserCreatePopup" element={<UserCreatePopup />} />
        <Route path="/UserCheckForm" element={<UserCheckForm />} />
        <Route path="/UpdateUser" element={<UpdateUser />} />
        <Route path="/AdminHome" element={<AdminHome />} />

        <Route path="/AdminLoginPage" element={<AdminLoginPage />} />
        <Route path="/CreateAdminPopup" element={<CreateAdminPopup />} />
        <Route path="/AdminGetAllData" element={<AdminGetAllData />} />
        <Route path="/AdminManageUsers" element={<AdminManageUsers />} />
        <Route path="/Admincrick" element={<Admincrick />} />
        <Route path="/dashboard" element={<UserDashboard />} />
  <Route
          path="/crick-links"
          element={<CustomerCrickLinks />}
        />

        {/* DETAIL PAGE (DYNAMIC ROUTE) */}
        <Route
          path="/crick-links/:customerId"
          element={<AllCustomerId />}
        />


        
      </Routes>
  <Footer />
  
    </BrowserRouter>
  );
}

export default App;
