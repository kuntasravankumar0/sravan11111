import React, { useState } from "react";
import "./allproject.css";

const Skillsdata = () => {
  const [activeTab, setActiveTab] = useState("skills");
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="employeeboxcontainer">

      {/* HEADER */}
      <div className="employeetopfeatures">
        <h1>My Skills & Experience</h1>
        <p>Explore my technical skills and work experience.</p>
      </div>

      {/* TABS */}
      <div className="tabs">
        <div
          className={`tab ${activeTab === "skills" ? "active" : ""}`}
          onClick={() => setActiveTab("skills")}
        >
          Skills
        </div>

        <div
          className={`tab ${activeTab === "experience" ? "active" : ""}`}
          onClick={() => setActiveTab("experience")}
        >
          Experience
        </div>

        <div
          className={`tab ${activeTab === "about" ? "active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          About Me
        </div>
      </div>

      {/* SKILLS */}
      {activeTab === "skills" && (
        <div className="employeesystemblock">
          <h2>Skills</h2>
          <ul>
            <li className="employeeinfoskyblue"><strong>Languages:</strong> Java, JavaScript</li>
            <li className="employeeinfoskyblue"><strong>Frontend:</strong> React, HTML, CSS</li>
            <li className="employeeinfoskyblue"><strong>Backend:</strong> Spring Boot</li>
            <li className="employeeinfoskyblue"><strong>Database:</strong> SQL, Oracle</li>
            <li className="employeeinfoskyblue"><strong>Tools:</strong> Git, JIRA, Maven</li>
          </ul>
        </div>
      )}

      {/* EXPERIENCE */}
      {activeTab === "experience" && (
        <div className="employeesystemblock">
          <h2>Experience</h2>
          <ul>
            <li className="employeeinfoskyblue">Developed Java + React apps</li>
            <li className="employeeinfoskyblue">Worked in Agile / Scrum teams</li>
            <li className="employeeinfoskyblue">Code reviews & optimization</li>
            <li className="employeeinfoskyblue">Managed versioning with Git</li>
          </ul>
        </div>
      )}

      {/* ABOUT */}
      {activeTab === "about" && (
        <div className="employeesystemblock">
          <h2>About Me</h2>

          <p className="employeeinfoskyblue">
            I am a Computer Science graduate with strong full-stack skills.
          </p>

          <button className="btn-outline-dark" onClick={() => setShowMore(!showMore)}>
            {showMore ? "Show Less" : "Show More"}
          </button>

          {showMore && (
            <div className="employeeinfoskyblue more-box">
              Passionate about backend, UI, and real-world problem solving.
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <div className="employeesystemblock footer-center">
        <p className="employeeinfoskyblue center">
          Welcome to my profile — <strong>Sravan Kumar</strong>
        </p>
      </div>
    </div>
  );
};

export default Skillsdata;
