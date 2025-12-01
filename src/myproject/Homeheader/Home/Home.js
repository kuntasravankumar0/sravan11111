import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import "../Home/Home.css";


function Home1() {
  const [isNameVisible, setIsNameVisible] = useState(false);
  const [clock, setClock] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    ampm: "AM",
  });

  const canvasRef = useRef(null);

  // Skill Popup
  const [skillPopupVisible, setSkillPopupVisible] = useState(false);
  const [skillPopupContent, setSkillPopupContent] = useState("");

  const gradients = [
    "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.2))",
    "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2))",
    "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(59,130,246,0.2))",
    "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(249,115,22,0.2))",
    "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(236,72,153,0.2))",
    "linear-gradient(135deg, rgba(147,51,234,0.2), rgba(79,70,229,0.2))",
    "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(20,184,166,0.2))",
  ];

  // ---------- 3D Globe ----------
  useEffect(() => {
    let scene, camera, renderer, globe, secondaryGlobe, particles, animationId;

    const init3D = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x0a0016, 1);

      const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
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

      const particleCount = 800;
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
        size: 0.02,
        color: 0xc084fc,
        transparent: true,
        opacity: 0.7,
      });

      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));

      const pointLight1 = new THREE.PointLight(0x8b5cf6, 1.2);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xc084fc, 0.8);
      pointLight2.position.set(-5, -5, -5);
      scene.add(pointLight2);
    };

    const animate3D = () => {
      animationId = requestAnimationFrame(animate3D);

      globe.rotation.y += 0.003;
      globe.rotation.x += 0.001;

      secondaryGlobe.rotation.y -= 0.002;
      particles.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    init3D();
    animate3D();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // ---------- Clock ----------
  useEffect(() => {
    const updateClock = () => {
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
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // ---------- Toggle Hero Background ----------
  const toggleHeroView = () => {
    const hero = document.getElementById("hero-section");
    hero.style.background =
      gradients[Math.floor(Math.random() * gradients.length)];

    setIsNameVisible((prev) => !prev);
  };

  // ---------- Skill Popup ----------
  const openSkillPopup = (text) => {
    setSkillPopupContent(text);
    setSkillPopupVisible(true);
  };

  return (
    <div className="home-container">
      <canvas ref={canvasRef} id="globe-canvas"></canvas>

      <div className="mycontainer">
        {/* HERO SECTION */}
        <div className="myhero-section" id="hero-section" onClick={toggleHeroView}>
          {!isNameVisible ? (
            <div className="myhero-content">
              <h1 className="myhero-title">Welcome to My Homepage</h1>
              <img src="https://sravan11111.wordpress.com/wp-content/uploads/2025/12/cropped_circle_image-1.png" alt="Logo" className="myhero-logo" />
            </div>
          ) : (
          
            <div class="glitch" data-text="5R4V4N.">5R4V4N</div>

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
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIKQcbhjf9bivOFuCnmGTgoo5Cr8C_2HBEvA&s"
                alt="Java Spring"
                className="myskill-image"
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
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyd8tnQveNvcEPWZtwaCHNqIMI3Tma2fhC6Q&s"
                alt="React"
                className="myskill-image"
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
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZGBMaKLpiftVAc0ZXVelbODnvUNFob0IOuA&s"
                alt="Database"
                className="myskill-image"
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
          onClick={() => setSkillPopupVisible(false)}
        >
          <div className="skill-popup-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="skill-popup-title">Skill Info</h2>
            <p className="skill-popup-text">{skillPopupContent}</p>

            <button
              className="skill-popup-close"
              onClick={() => setSkillPopupVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home1;
