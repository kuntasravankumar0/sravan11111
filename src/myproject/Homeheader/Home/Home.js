import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import * as THREE from "three";
import "../Home/Home.css";

import CommentBox from '../../components/CommentBox';
import CommentsList from '../../components/CommentsList';
import BottomPart from '../Header/BottomPart';

function Home1() {
  const [isNameVisible, setIsNameVisible] = useState(false);
  const [clock, setClock] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    ampm: "AM",
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [skillPopupVisible, setSkillPopupVisible] = useState(false);
  const [skillPopupContent, setSkillPopupContent] = useState("");
  const [globeEnabled] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  // Memoized gradients to prevent recreation
  const gradients = useMemo(() => [
    "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.2))",
    "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2))",
    "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(59,130,246,0.2))",
    "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(249,115,22,0.2))",
    "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(236,72,153,0.2))",
    "linear-gradient(135deg, rgba(147,51,234,0.2), rgba(79,70,229,0.2))",
    "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(20,184,166,0.2))",
  ], []);

  // Detect mobile and performance capabilities
  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768;
      setIsMobile(isMobileDevice);

      // Check for low-performance indicators
      const isLowPerf = isMobileDevice ||
        navigator.hardwareConcurrency <= 2 ||
        window.devicePixelRatio > 2;
      setIsLowPerformance(isLowPerf);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Optimized 3D Globe with mobile performance considerations
  useEffect(() => {
    if (!globeEnabled) return;

    let scene, camera, renderer, globe, secondaryGlobe, particles;

    const init3D = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      scene = new THREE.Scene();
      sceneRef.current = scene;

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile, // Disable antialiasing on mobile for performance
        powerPreference: isMobile ? "low-power" : "high-performance"
      });
      rendererRef.current = renderer;

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setClearColor(0x0a0016, 1);

      // Optimized globe geometry based on device capability
      const globeSegments = isLowPerformance ? 32 : 64;
      const globeGeometry = new THREE.SphereGeometry(2, globeSegments, globeSegments);
      const globeMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        emissive: 0x3b0764,
        emissiveIntensity: 0.5,
      });
      globe = new THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globe);

      // Secondary globe with reduced complexity on mobile
      if (!isLowPerformance) {
        const secondaryGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const secondaryMaterial = new THREE.MeshStandardMaterial({
          color: 0xa855f7,
          wireframe: true,
          transparent: true,
          opacity: 0.4,
        });
        secondaryGlobe = new THREE.Mesh(secondaryGeometry, secondaryMaterial);
        secondaryGlobe.position.set(3, 1, 0);
        scene.add(secondaryGlobe);
      }

      // Reduced particle count for mobile
      const particleCount = isLowPerformance ? 200 : 800;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      const particleMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.03 : 0.02,
        color: 0xc084fc,
        transparent: true,
        opacity: 0.7,
      });

      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      // Simplified lighting for mobile
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));

      if (!isLowPerformance) {
        const pointLight1 = new THREE.PointLight(0x8b5cf6, 1.2);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xc084fc, 0.8);
        pointLight2.position.set(-5, -5, -5);
        scene.add(pointLight2);
      }
    };

    const animate3D = () => {
      animationIdRef.current = requestAnimationFrame(animate3D);

      if (globe) {
        // Slower animation on mobile to save battery
        const rotationSpeed = isMobile ? 0.002 : 0.003;
        globe.rotation.y += rotationSpeed;
        globe.rotation.x += rotationSpeed * 0.3;
      }

      if (secondaryGlobe) {
        secondaryGlobe.rotation.y -= 0.002;
      }

      if (particles) {
        particles.rotation.y += isMobile ? 0.0003 : 0.0005;
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    init3D();
    animate3D();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [isMobile, isLowPerformance, globeEnabled]);

  // Optimized clock update with useCallback
  const updateClock = useCallback(() => {
    const now = new Date();
    let h = now.getHours(),
      m = now.getMinutes(),
      s = now.getSeconds();

    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    setClock({
      hours: String(h).padStart(2, "0"),
      minutes: String(m).padStart(2, "0"),
      seconds: String(s).padStart(2, "0"),
      ampm,
    });
  }, []);

  useEffect(() => {
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [updateClock]);

  // Optimized hero background toggle
  const toggleHeroView = useCallback(() => {
    const hero = document.getElementById("hero-section");
    if (hero) {
      hero.style.background = gradients[Math.floor(Math.random() * gradients.length)];
    }
    setIsNameVisible(prev => !prev);
  }, [gradients]);

  // Skill popup handlers
  const openSkillPopup = useCallback((text) => {
    setSkillPopupContent(text);
    setSkillPopupVisible(true);
  }, []);

  const closeSkillPopup = useCallback(() => {
    setSkillPopupVisible(false);
  }, []);

  // Comment handler
  const handleCommentSubmit = useCallback(() => {
    // Trigger refresh of comments list
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="home-container">
      {/* Performance controls removed as requested */}

      {globeEnabled && <canvas ref={canvasRef} id="globe-canvas"></canvas>}

      <div className="mycontainer">
        {/* HERO SECTION */}
        <div
          className="myhero-section"
          id="hero-section"
          onClick={toggleHeroView}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleHeroView()}
          aria-label="Toggle hero view"
        >
          {!isNameVisible ? (
            <div className="myhero-content">
              <h1 className="myhero-title">Welcome to My Homepage</h1>
              <img
                src="https://sravan11111.wordpress.com/wp-content/uploads/2025/12/cropped_circle_image-1.png"
                alt="Profile Logo"
                className="myhero-logo"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="glitch" data-text="5R4V4N.">5R4V4N</div>
          )}
        </div>

        {/* CLOCK */}
        <div className="myclock-container">
          {["hours", "minutes", "seconds"].map((unit) => (
            <div className="myclock-item" key={unit}>
              <div className="myclock-label">
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
              </div>
              <div className="myclock-circle">{clock[unit]}</div>
            </div>
          ))}
          <div className="myclock-ampm">{clock.ampm}</div>
        </div>

        {/* SKILLS */}
        <section className="myskills-section">
          <h2>Skills</h2>

          <div className="myskills-grid">
            <div
              className="myskill-card"
              onClick={() =>
                openSkillPopup(
                  "Java & Spring — Backend Projects, APIs, Hibernate, JPA"
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openSkillPopup("Java & Spring — Backend Projects, APIs, Hibernate, JPA")}
              aria-label="Backend Developer Skills"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIKQcbhjf9bivOFuCnmGTgoo5Cr8C_2HBEvA&s"
                alt="Java Spring Framework"
                className="myskill-image"
                loading="lazy"
              />
              <p className="myskill-title">Back-End Developer</p>
            </div>

            <div
              className="myskill-card"
              onClick={() =>
                openSkillPopup(
                  "React — Frontend Development, UI/UX, Component-Based Design"
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openSkillPopup("React — Frontend Development, UI/UX, Component-Based Design")}
              aria-label="Web Developer Skills"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyd8tnQveNvcEPWZtwaCHNqIMI3Tma2fhC6Q&s"
                alt="React Framework"
                className="myskill-image"
                loading="lazy"
              />
              <p className="myskill-title">Web Developer</p>
            </div>

            <div
              className="myskill-card"
              onClick={() =>
                openSkillPopup(
                  "Database — MySQL, MongoDB, Data Modeling, Queries"
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openSkillPopup("Database — MySQL, MongoDB, Data Modeling, Queries")}
              aria-label="Database Technology Skills"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZGBMaKLpiftVAc0ZXVelbODnvUNFob0IOuA&s"
                alt="Database Technologies"
                className="myskill-image"
                loading="lazy"
              />
              <p className="myskill-title">Database Technologies</p>
            </div>
          </div>
        </section>
      </div>

      {/* SKILL POPUP */}
      {skillPopupVisible && (
        <div
          className="skill-popup-overlay"
          onClick={closeSkillPopup}
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-popup-title"
        >
          <div
            className="skill-popup-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="skill-popup-title" className="skill-popup-title">Skill Info</h2>
            <p className="skill-popup-text">{skillPopupContent}</p>

            <button
              className="skill-popup-close"
              onClick={closeSkillPopup}
              aria-label="Close skill popup"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Comments and Links Section */}
      <div className="comments-section-wrapper">
        <CommentBox onCommentSubmit={handleCommentSubmit} />
        <CommentsList refreshTrigger={refreshTrigger} />
      </div>

      {/* Bottom Part - Only shown on Home page */}
      <BottomPart />
    </div>
  );
}

export default Home1;
