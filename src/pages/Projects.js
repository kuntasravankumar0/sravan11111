import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ShoppingCart, Gamepad2, Globe, Star, ArrowUpRight, Sparkles } from 'lucide-react';
import './Projects.css';

const projects = [
  {
    id: 1,
    title: 'Ashoping',
    subtitle: 'E-Commerce Platform',
    description: 'A full-featured online shopping platform with product catalog, cart system, user authentication, and seamless checkout experience.',
    url: 'https://ashoping.vercel.app/',
    icon: ShoppingCart,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    tags: ['React', 'E-Commerce', 'Vercel', 'Full Stack'],
    features: ['Product Catalog', 'Shopping Cart', 'User Auth', 'Responsive Design'],
    status: 'Live',
  },
  {
    id: 2,
    title: 'Ludo Room',
    subtitle: 'Multiplayer Game',
    description: 'An interactive multiplayer Ludo board game with real-time gameplay, room creation, and smooth animations for an engaging gaming experience.',
    url: 'https://ludoroom.vercel.app/',
    icon: Gamepad2,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    tags: ['React', 'Game', 'Multiplayer', 'Real-time'],
    features: ['Multiplayer Rooms', 'Real-time Play', 'Animations', 'Mobile Friendly'],
    status: 'Live',
  },
  {
    id: 3,
    title: 'Link Frontend',
    subtitle: 'Resource Hub',
    description: 'A centralized platform for managing and sharing useful links, resources, and tools with a clean interface and organized categories.',
    url: 'https://linkfrontend.onrender.com/',
    icon: Globe,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    tags: ['React', 'Links', 'Render', 'Dashboard'],
    features: ['Link Management', 'Categories', 'Search', 'Clean UI'],
    status: 'Live',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Projects() {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="projects-page">
      {/* Hero */}
      <section className="projects-hero">
        <div className="container">
          <motion.div
            className="projects-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} />
              <span>Live Projects</span>
            </motion.div>
            <h1>
              My <span className="gradient-text">Projects</span>
            </h1>
            <p>Explore live applications built with modern technologies and premium design.</p>
          </motion.div>
        </div>
        <div className="projects-hero-glow" />
      </section>

      {/* Projects Grid */}
      <section className="projects-section">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                className="project-card glass"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover="hover"
                onClick={() => setSelectedProject(project)}
              >
                {/* Card Glow Effect */}
                <motion.div
                  className="card-glow"
                  style={{ background: project.gradient }}
                  animate={{ opacity: hoveredId === project.id ? 0.15 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Card Header */}
                <div className="project-card-header">
                  <motion.div
                    className="project-icon"
                    style={{ background: project.gradient }}
                    animate={hoveredId === project.id ? { rotate: [0, -5, 5, 0], scale: 1.1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <project.icon size={28} />
                  </motion.div>
                  <div className="project-status">
                    <span className="status-dot" />
                    {project.status}
                  </div>
                </div>

                {/* Card Body */}
                <div className="project-card-body">
                  <h3>{project.title}</h3>
                  <span className="project-subtitle">{project.subtitle}</span>
                  <p>{project.description}</p>

                  {/* Tags */}
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="project-features">
                    {project.features.map((feat) => (
                      <div key={feat} className="feature-item">
                        <Star size={12} style={{ color: project.color }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="project-card-footer">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link-btn"
                    style={{ background: project.gradient }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe size={16} />
                    Visit Live
                    <ArrowUpRight size={14} />
                  </a>
                </div>

                {/* Animated border on hover */}
                <motion.div
                  className="card-border-glow"
                  style={{ borderColor: project.color }}
                  animate={{ opacity: hoveredId === project.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="projects-stats">
        <div className="container">
          <motion.div
            className="stats-row"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="stat-block">
              <span className="stat-number">3+</span>
              <span className="stat-text">Live Projects</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-block">
              <span className="stat-number">React</span>
              <span className="stat-text">Frontend Stack</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-block">
              <span className="stat-number">100%</span>
              <span className="stat-text">Responsive</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-block">
              <span className="stat-number">Vercel</span>
              <span className="stat-text">Deployed On</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="project-modal glass-strong"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedProject(null)}>&times;</button>

              <div className="modal-hero" style={{ background: selectedProject.gradient }}>
                <selectedProject.icon size={48} />
                <h2>{selectedProject.title}</h2>
                <span>{selectedProject.subtitle}</span>
              </div>

              <div className="modal-body">
                <p>{selectedProject.description}</p>

                <h4>Key Features</h4>
                <div className="modal-features">
                  {selectedProject.features.map((feat) => (
                    <div key={feat} className="modal-feature-item">
                      <Star size={14} style={{ color: selectedProject.color }} />
                      {feat}
                    </div>
                  ))}
                </div>

                <h4>Technologies</h4>
                <div className="project-tags" style={{ marginBottom: '24px' }}>
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>

                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <ExternalLink size={18} />
                  Open {selectedProject.title}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
