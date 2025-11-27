import React from "react";
import "../header/MoreOptions.css"

function MoreOptions() {
  return (
    <div className="more-options-container">
      <h2 className="more-options-title">More Options</h2>

      <div className="more-options-grid">
       
       
       
       


       <a href="/UserCheckForm" className="more-option-card">
          <div className="icon-circle">👤</div>
          <div className="option-text">
            <h3>loginpage</h3>
            <p> user loginpage data 💼</p>
          </div>
        </a>

         <a href="/AdminLoginPage" className="more-option-card"> 
          <div className="icon-circle">🛠️</div>
          <div className="option-text">
            <h3>Admin</h3>
            <p>can handle user data🛡️</p>
          </div>
        </a>

 <a href="/GetAllByCategory" className="more-option-card">
          <div className="icon-circle">🔗</div>
          <div className="option-text">
            <h3>Links </h3>
            <p>Links </p>
          </div>
        </a>

 

        
      </div>



      <p className="coming-soon-text">🚧 More exciting features coming soon!</p>
    </div>
  );
}

export default MoreOptions;
