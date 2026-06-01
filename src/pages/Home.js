import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import ParticleField from '../components/three/ParticleField';
import { commentService, presenceService } from '../config/api';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
];

export default function Home() {
  const [comments, setComments] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    commentService.getApproved().then((res) => {
      setComments(res.data?.slice(0, 6) || []);
    }).catch(() => {});

    presenceService.getCount().then((res) => {
      setOnlineCount(res.data?.count || 0);
    }).catch(() => {});

    // Rotate quotes
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <ParticleField />
        <div className="container hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge-dot" />
            <span>{onlineCount} users online now</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Build Something
            <span className="gradient-text"> Extraordinary</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A premium platform crafted with passion, powered by modern technology,
            and designed to inspire creativity.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/templates" className="btn-primary">
              View Projects <ArrowRight size={18} />
            </Link>
            <Link to="/tools" className="btn-secondary">
              Explore Tools
            </Link>
          </motion.div>
        </div>
        <div className="hero-gradient-blur" />
      </section>

      {/* Quotes Section */}
      <section className="section quotes-section">
        <div className="container">
          <motion.div
            className="quote-card glass-strong"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Quote size={40} className="quote-icon" />
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <p className="quote-text">"{quotes[currentQuote].text}"</p>
              <span className="quote-author">— {quotes[currentQuote].author}</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials / Comments Section */}
      {comments.length > 0 && (
        <section className="section comments-section">
          <div className="container">
            <motion.div
              className="section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2>What People Say</h2>
              <p>Community feedback and testimonials.</p>
            </motion.div>

            <div className="comments-grid">
              {comments.map((comment, i) => (
                <motion.div
                  key={comment.id}
                  className="comment-card glass"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <p className="comment-content">"{comment.content}"</p>
                  <div className="comment-author">
                    <div className="author-avatar">
                      {comment.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="author-name">{comment.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <motion.div
            className="cta-card glass-strong"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2>Ready to Connect?</h2>
            <p>Reach out and let's build something amazing together.</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn-primary">
                Get in Touch <ArrowRight size={18} />
              </Link>
              <Link to="/templates" className="btn-secondary">
                View Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
