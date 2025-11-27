import React, { useState } from "react";
import './Header.css'
import MoreOptions from "../header/MoreOptions"

function Header() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeContent, setActiveContent] = useState("");

  return (
    <div>
      <header className="header-navigation-bar-container">
        <div className="site-owner-name-display-section">K Sravan</div>
        <nav className="navigation-menu-items-wrapper">
          <a href="https://sravan11111.wordpress.com">Home</a>
          <a href="https://www.instagram.com/ksravankumar0/">Insta</a>
          <a href="/skills">About</a>
          <a
            href="#projects"
            onClick={() => {
              setActiveContent("projects");
              setIsPopupVisible(true);
            }}
          >
            Projects
          </a>
          <a
            href="#more"
            onClick={() => {
              setActiveContent("more");
              setIsPopupVisible(true);
            }}
          >
            More
          </a>
        </nav>
      </header>

      {isPopupVisible && (
        <div
          className="popup-overlay-display-container"
          onClick={(e) => {
            if (e.target.classList.contains("popup-overlay-display-container"))
              setIsPopupVisible(false);
          }}
        >
          <div className="popup-content-wrapper-container">
            <span
              className="popup-close-button-unique"
              onClick={() => setIsPopupVisible(false)}
            >
              &times;
            </span>

            {activeContent === "projects" && (
              <div id="projectsContent">
               <center>   <h1>My Projects</h1></center> 
                <div className="projects-grid-display-container">
                  {/* Project 1 */}
                  <div className="project-card-display-container">
                    <div className="project-info-section-wrapper">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPn-ZA8WXbPR7wl9r8DimTX9SzQq9q7jnH9w&s"
                        alt="Employee"
                        className="project-image-style-wrapper"
                      />
                      <div>
                        <h3 className="project-title-header-style">Employee</h3>
                        <p className="project-description-text-style">
                          Employee Management
                        </p>
                      </div>
                    </div>
                    <a
                      href="/EmployeeManagementSystem"
                      className="project-button-link-style"
                    >
                      Open
                    </a>
                  </div>

                  {/* Project 2 */}
                  <div className="project-card-display-container">
                    <div className="project-info-section-wrapper">
                      <img
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop"
                        alt="Property"
                        className="project-image-style-wrapper"
                      />
                      <div>
                        <h3 className="project-title-header-style">Property</h3>
                        <p className="project-description-text-style">
                          Property Insurance
                        </p>
                      </div>
                    </div>
                    <a
                      href="/PropertyInsurance"
                      className="project-button-link-style"
                    >
                      Open
                    </a>
                  </div>

                  {/* Project 3 */}
                  <div className="project-card-display-container">
                    <div className="project-info-section-wrapper">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgjve_pIggmZNqYSwXYm_L-pbDQx7ZSgtypg&s"
                        alt="Vote"
                        className="project-image-style-wrapper"
                      />
                      <div>
                        <h3 className="project-title-header-style">Vote</h3>
                        <p className="project-description-text-style">
                          Online Voting System
                        </p>
                      </div>
                    </div>
                    <a
                      href="/VotingSystemDescription"
                      className="project-button-link-style"
                    >
                      Open
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ Use the new MoreOptions component */}
            {activeContent === "more" && <MoreOptions />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
