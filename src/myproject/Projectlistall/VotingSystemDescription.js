import React from "react";
import "./allproject.css";

function VotingSystemDescription() {
  return (
    <div className="employeeboxcontainer">

      <div className="employeetopfeatures">
        <h1>Voting System Features</h1>
        <p>A secure digital voting system for admins and voters.</p>
        <p>
          <br></br>
          <a
            href="https://github.com/kuntasravankumar0/voteproject"
            className="btn-outline-dark"
              rel="noopener noreferrer"
            target="_blank"
          >
            Visit GitHub Repository
          </a>
        </p>
      </div>

      {/* MAIN FEATURES */}
      <div className="employeesystemblock">
        <h2>How It Works</h2>

        {[
          "Real-time voter data for admins",
          "Mobile number-based search",
          "Secure OTP login",
          "Admin controls for profiles",
          "Fast filtering & search",
          "Password reset with OTP",
          "Updated voter data",
          "Region-wise filtering",
          "Real-time notifications",
          "Multilingual support",
          "Scalable for large data",
          "Strong data security",
          "Transparent election process",
          "Detailed admin reports",
          "Supports auditing & verification"
        ].map((item, index) => (
          <div key={index} className="employeeinfoskyblue">{item}</div>
        ))}
      </div>

    </div>
  );
}

export default VotingSystemDescription;
