import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, Copy, Check } from 'lucide-react';
import '../Tools.css';

export default function TextTools() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = {
    characters: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    sentences: text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0,
    lines: text.trim() ? text.split('\n').length : 0,
  };

  const transform = (fn) => setText(fn(text));

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-page">
      <div className="container">
        <motion.div
          className="tool-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="tool-icon-wrap"><Type size={32} /></div>
          <h1>Text Tools</h1>
          <p>Transform, analyze, and manipulate text instantly.</p>
        </motion.div>

        <motion.div
          className="tool-card glass-strong"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <textarea
            className="tool-textarea"
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
          />

          <div className="text-stats">
            <span>{stats.characters} chars</span>
            <span>{stats.words} words</span>
            <span>{stats.sentences} sentences</span>
            <span>{stats.lines} lines</span>
          </div>

          <div className="text-actions">
            <button onClick={() => transform(t => t.toUpperCase())}>UPPERCASE</button>
            <button onClick={() => transform(t => t.toLowerCase())}>lowercase</button>
            <button onClick={() => transform(t => t.replace(/\b\w/g, c => c.toUpperCase()))}>Title Case</button>
            <button onClick={() => transform(t => t.split('').reverse().join(''))}>Reverse</button>
            <button onClick={() => transform(t => t.replace(/\s+/g, ' ').trim())}>Trim Spaces</button>
            <button onClick={() => setText('')}>Clear</button>
            <button onClick={copyText} className={copied ? 'copied' : ''}>
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
