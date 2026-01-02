import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-section">
          <h4>About</h4>
          <p>
            Sravan is a software developer focused on building clean,
            scalable, and performance-driven web applications.
          </p>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <ul>
            <li>
              <a
                href="https://www.instagram.com/ksravankumar0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/@sravan11111"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>More</h4>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/helpall">help</a></li>
          
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Sravan. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
