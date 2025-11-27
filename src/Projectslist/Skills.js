import React, { useState } from "react";
import "./allproject.css";

const Skillsdata = () => {
  const [activeTab, setActiveTab] = useState("skills");
  const [showMore, setShowMore] = useState(false);

  const showTab = (tabId) => setActiveTab(tabId);
  const toggleVisibility = () => setShowMore(!showMore);

  return (
    <div className="employeeboxcontainer">

      {/* HEADER */}
      <div className="employeetopfeatures">
        <h1>My Skills & Experience</h1>
        <p>Explore my technical skills, work experience, and personal background.</p>
      </div>

      {/* TABS */}
      <div className="tabs">
        <div
          className={`tab ${activeTab === "skills" ? "active" : ""}`}
          onClick={() => showTab("skills")}
        >
          Skills
        </div>

        <div
          className={`tab ${activeTab === "experience" ? "active" : ""}`}
          onClick={() => showTab("experience")}
        >
          Experience
        </div>

        <div
          className={`tab ${activeTab === "about" ? "active" : ""}`}
          onClick={() => showTab("about")}
        >
          About Me
        </div>
      </div>

      {/* SKILLS SECTION */}
      {activeTab === "skills" && (
        <div className="employeesystemblock">
          <h2>Skills</h2>

          <ul>
            <li className="employeeinfoskyblue">
              <strong>Programming Languages:</strong> Java, JavaScript
            </li>
            <li className="employeeinfoskyblue">
              <strong>Web Technologies:</strong> React, Spring, HTML5, CSS3
            </li>
            <li className="employeeinfoskyblue">
              <strong>Database Management:</strong> Oracle, SQL, PL/SQL
            </li>
            <li className="employeeinfoskyblue">
              <strong>Tools & Frameworks:</strong> Git, JIRA, Maven
            </li>
            <li className="employeeinfoskyblue">
              <strong>Development Methodologies:</strong> Agile, Scrum
            </li>
          </ul>
        </div>
      )}

      {/* EXPERIENCE SECTION */}
      {activeTab === "experience" && (
        <div className="employeesystemblock">
          <h2>Experience</h2>

          <ul>
            <li className="employeeinfoskyblue">
              <strong>Developed dynamic web applications</strong> using Java,
              React, and Spring Boot.
            </li>
            <li className="employeeinfoskyblue">
              <strong>Contributed to Agile development cycles,</strong> improving
              teamwork and delivery speed.
            </li>
            <li className="employeeinfoskyblue">
              <strong>Participated in code reviews,</strong> ensuring clean and
              efficient code.
            </li>
            <li className="employeeinfoskyblue">
              <strong>Used Git, JIRA, and Maven</strong> for version control and
              project tracking.
            </li>
          </ul>
        </div>
      )}

      {/* ABOUT SECTION */}
      {activeTab === "about" && (
        <div className="employeesystemblock">
          <h2>About Me</h2>

          <p className="employeeinfoskyblue">
            I am a Computer Science graduate skilled in Java Full Stack
            Development. I enjoy working on backend systems, UI design, and
            solving real-world problems using technology.
          </p>

          <button className="btn-outline-dark" onClick={toggleVisibility}>
            {showMore ? "Show Less" : "Show More"}
          </button>

          {showMore && (
            <div className="employeeinfoskyblue" style={{ marginTop: "15px" }}>
              <h3>More Details</h3>
              <p>
                I am passionate about coding, collaboration, and continuous
                learning. My goal is to master full-stack development and
                contribute to impactful software projects.
              </p>
            </div>
          )}
        </div>
      )}

      {/* FOOTER MESSAGE */}
      <div className="employeesystemblock">
        <p className="employeeinfoskyblue" style={{ textAlign: "center" }}>
          Welcome to my profile. <strong>Sravan Kumar</strong>
        </p>
      </div>
    </div>
  );
};

export default Skillsdata;
