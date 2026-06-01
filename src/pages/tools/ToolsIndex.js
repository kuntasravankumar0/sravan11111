import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Calculator, Volume2, Type, Keyboard, Ruler } from 'lucide-react';
import '../Tools.css';

const tools = [
  { path: '/tools/qr-code', icon: QrCode, title: 'QR Code Generator', desc: 'Generate QR codes for any text or URL.' },
  { path: '/tools/calculator', icon: Calculator, title: 'Calculator', desc: 'Clean calculator for quick math.' },
  { path: '/tools/speaker', icon: Volume2, title: 'Fix My Speaker', desc: 'Eject water from your phone speaker.' },
  { path: '/tools/text', icon: Type, title: 'Text Tools', desc: 'Transform and analyze text.' },
  { path: '/tools/typing', icon: Keyboard, title: 'Typing Speed Test', desc: 'Test your typing speed and accuracy.' },
  { path: '/tools/converter', icon: Ruler, title: 'Unit Converter', desc: 'Convert between measurement units.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08 },
  }),
};

export default function ToolsIndex() {
  return (
    <div className="tool-page">
      <div className="container">
        <motion.div
          className="tool-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1>Utility Tools</h1>
          <p>Free premium tools for everyday use.</p>
        </motion.div>

        <div className="tools-grid">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.path}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Link to={tool.path} className="tool-link-card glass">
                <div className="feature-icon">
                  <tool.icon size={24} />
                </div>
                <h4>{tool.title}</h4>
                <p>{tool.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
