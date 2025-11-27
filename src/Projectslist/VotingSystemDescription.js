import React from "react";
import "./allproject.css"; // optional, can remove if not needed

function VotingSystemDescription() {
  return (
    <div className="employeeboxcontainer">

      {/* HEADER */}
      <div className="employeetopfeatures">
        <h1>Voting System Features</h1>

        <p>
          A secure and user-friendly digital voting system for admins and voters.
        </p>

        <p>
          <a
            href="https://github.com/kuntasravankumar0/voteproject"
            className="btn btn-outline-dark"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit GitHub Repository
          </a>
        </p>
      </div>

      {/* MAIN SYSTEM EXPLANATIONS */}
      <div className="employeesystemblock">
        <h2>How the Voting System Works</h2>

        <div className="employeeinfoskyblue">
          The voting system displays all voter data to admins in real-time.
        </div>

        <div className="employeeinfoskyblue">
          Admins can search voter information using mobile numbers.
        </div>

        <div className="employeeinfoskyblue">
          Voters register using their mobile number and create a secure password.
        </div>

        <div className="employeeinfoskyblue">
          A secure OTP is sent to the voter during login to ensure authentication.
        </div>

        <div className="employeeinfoskyblue">
          OTP verification guarantees only the correct user can access the system.
        </div>

        <div className="employeeinfoskyblue">
          Mobile number validation is required during registration.
        </div>

        <div className="employeeinfoskyblue">
          Admins can view registration status, manage profiles, and monitor activity.
        </div>

        <div className="employeeinfoskyblue">
          Fast search and filtering options allow admins to find data easily.
        </div>

        <div className="employeeinfoskyblue">
          Voters can reset their password via OTP if forgotten.
        </div>

        <div className="employeeinfoskyblue">
          Built with a user-friendly and secure interface for voters and admins.
        </div>

        <div className="employeeinfoskyblue">
          Voter information is regularly updated to ensure accuracy.
        </div>

        <div className="employeeinfoskyblue">
          Admins can filter voters by region and eligibility.
        </div>

        <div className="employeeinfoskyblue">
          Real-time notifications keep voters informed about updates.
        </div>

        <div className="employeeinfoskyblue">
          Multilingual support is available for inclusive voting.
        </div>

        <div className="employeeinfoskyblue">
          Highly scalable system capable of handling large voter databases.
        </div>

        <div className="employeeinfoskyblue">
          Strong security protocols protect voter data and the voting process.
        </div>

        <div className="employeeinfoskyblue">
          Transparent processes ensure trust and credibility in elections.
        </div>

        <div className="employeeinfoskyblue">
          Detailed reports help admins analyze participation and trends.
        </div>

        <div className="employeeinfoskyblue">
          System supports vote auditing and result verification.
        </div>
      </div>
    </div>
  );
}

export default VotingSystemDescription;
