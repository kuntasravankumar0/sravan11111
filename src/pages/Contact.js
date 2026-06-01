import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, CheckCircle, MapPin, Phone } from 'lucide-react';
import { contactService } from '../config/api';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contactService.submit(form);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1>Let's <span className="gradient-text">Connect</span></h1>
          <p>Have a question, idea, or just want to say hello? Drop a message below.</p>
        </motion.div>

        <div className="contact-layout">
          {/* Info Side */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="info-card glass">
              <div className="info-item">
                <div className="info-icon"><Mail size={20} /></div>
                <div>
                  <h4>Email</h4>
                  <p>contact@sravan.dev</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><MapPin size={20} /></div>
                <div>
                  <h4>Location</h4>
                  <p>India</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><Phone size={20} /></div>
                <div>
                  <h4>Response Time</h4>
                  <p>Within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="contact-quote glass">
              <p>"Great things are built by people who care about the details."</p>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            className="contact-form-card glass-strong"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {sent ? (
              <div className="success-state">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle size={64} className="success-icon" />
                </motion.div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. I'll get back to you soon.</p>
                <button className="btn-secondary" onClick={() => setSent(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="form-title">Send a Message</h3>

                {error && (
                  <motion.div className="form-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {error}
                  </motion.div>
                )}

                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <div className="input-wrap">
                    <User size={18} className="input-icon" />
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrap">
                    <Mail size={18} className="input-icon" />
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <div className="input-wrap textarea-wrap">
                    <MessageSquare size={18} className="input-icon textarea-icon" />
                    <textarea
                      id="message"
                      placeholder="Tell me about your project or idea..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={5}
                    />
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <><span className="spinner" /> Sending...</>
                  ) : (
                    <><Send size={18} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
