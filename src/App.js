import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./header/Header";
import Home from "./Home/Home";
import VotingSystemDescription from "./Projectslist/VotingSystemDescription";
import Skillsdata from "./Projectslist/Skills";
import EmployeeManagementSystem from "./Projectslist/employee";
import PropertyInsurance from "./Projectslist/PropertyInsurance";
import LinksManager from "./Adminpages/LinksManager";
import UserTable from "./Adminpages/UserTable";
import Login from "./Loginpages/Login";
import LoginEdit from "./Loginpages/LoginEdit";
import UserCreatePopup from "./Loginpages/UserCreatePopup";
import UserCheckForm from "./Loginpages/UserCheckForm";
import UpdateUser from "./Loginpages/UpdateUser";
import AdminHome from "./Adminpages/AllAdminlinks";
import GetAllByCategory from "./header/GetAllByCategory";
import AdminLoginPage from "./Adminloginpages/AdminLoginPage";
import CreateAdminPopup from "./Adminloginpages/CreateAdminPopup";
import AdminGetAllData from "./Adminloginpages/AdminGetAllData";
import AdminManageUsers from "./Adminloginpages/AdminManageUsers";

import { useEffect, useState } from "react";











function App() {



  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate backend connection delay (2 seconds)
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="global-loader">
        <div className="global-spinner"></div>
        <p>Loading Application...</p>
      </div>
    );
  }






  return (
    
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

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
        <Route path="/" element={<Home />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
