import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, RotateCcw, Sparkles, Clock, Target, Zap, Trophy, AlertCircle } from 'lucide-react';
import '../Tools.css';
import './TypingSpeedTest.css';

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY || '';

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice and font display.",
  "Technology has revolutionized the way we communicate, work, and live our daily lives. From smartphones to artificial intelligence, innovation continues to shape our future in remarkable ways.",
  "Programming requires attention to detail, logical thinking, and creative problem-solving skills. Every line of code serves a purpose in creating elegant software solutions that help people.",
  "The internet has connected billions of people across the globe, enabling instant communication and providing access to vast amounts of information at our fingertips every single day.",
  "Artificial intelligence and machine learning are transforming industries worldwide, from healthcare diagnostics to autonomous transportation, creating new possibilities for human advancement and discovery.",
  "Education is the foundation of all progress, empowering individuals with knowledge, critical thinking skills, and the ability to contribute meaningfully to society and their communities.",
  "Great software is built by teams who communicate well, write clean code, test thoroughly, and never stop learning from their mistakes and successes along the way.",
  "The best way to predict the future is to create it. Every great achievement started as a simple idea in someone's mind before becoming reality through hard work and dedication.",
];

const timeOptions = [30, 60, 120, 180];

export default function TypingSpeedTest() {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedTime, setSelectedTime] = useState(60);
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScores, setBestScores] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiError, setAiError] = useState('');
  const inputRef = useRef(null);

  // Load scores & init text
  useEffect(() => {
    const saved = localStorage.getItem('typingBestScores');
    if (saved) setBestScores(JSON.parse(saved));
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  }, []);

  // Timer
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsActive(false);
          setIsFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Stats calculation
  const stats = useMemo(() => {
    if (!startTime || input.length === 0) return { wpm: 0, accuracy: 100, cpm: 0 };
    const elapsed = Math.max((selectedTime - timeLeft), 1);
    const minutes = elapsed / 60;
    const words = input.trim().split(/\s+/).filter(Boolean).length;
    const wpm = Math.round(words / minutes);
    const accuracy = input.length > 0 ? Math.round(((input.length - mistakes) / input.length) * 100) : 100;
    const cpm = Math.round(input.length / minutes);
    return { wpm: Math.max(wpm, 0), accuracy: Math.max(accuracy, 0), cpm };
  }, [input, startTime, mistakes, selectedTime, timeLeft]);

  // Handle typing
  const handleInput = useCallback((e) => {
    const val = e.target.value;
    if (isFinished) return;

    if (!isActive && val.length === 1) {
      setStartTime(Date.now());
      setIsActive(true);
    }

    setInput(val);

    // Count mistakes
    let errs = 0;
    for (let i = 0; i < val.length; i++) {
      if (i < text.length && val[i] !== text[i]) errs++;
    }
    setMistakes(errs);

    // Auto-finish if typed all text
    if (val.length >= text.length) {
      setIsActive(false);
      setIsFinished(true);
    }
  }, [isActive, isFinished, text]);

  // Save score and reset
  const reset = useCallback(() => {
    if (isFinished && stats.wpm > 0) {
      const score = { wpm: stats.wpm, accuracy: stats.accuracy, date: new Date().toLocaleDateString(), time: selectedTime };
      const updated = [...bestScores, score].sort((a, b) => b.wpm - a.wpm).slice(0, 5);
      setBestScores(updated);
      localStorage.setItem('typingBestScores', JSON.stringify(updated));
    }
    setInput('');
    setStartTime(null);
    setIsActive(false);
    setTimeLeft(selectedTime);
    setMistakes(0);
    setIsFinished(false);
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [isFinished, stats, bestScores, selectedTime]);

  // AI text generation via Groq
  const generateAIText = useCallback(async () => {
    if (!aiTopic.trim()) return;
    if (!GROQ_API_KEY) {
      setAiError('AI key not configured. Set REACT_APP_GROQ_API_KEY in .env');
      return;
    }
    setAiLoading(true);
    setAiError('');

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a typing test text generator. Generate exactly one paragraph of 50-80 words suitable for a typing speed test. Use simple punctuation (periods, commas). No special characters, no quotes, no bullet points. Just flowing natural text. Do not include any prefix or explanation.'
            },
            {
              role: 'user',
              content: `Generate a typing test paragraph about: ${aiTopic}`
            }
          ],
          max_tokens: 200,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const generated = data.choices?.[0]?.message?.content?.trim();

      if (generated) {
        // Clean the text
        const cleaned = generated.replace(/^["']|["']$/g, '').replace(/\n/g, ' ').trim();
        setText(cleaned);
        setInput('');
        setStartTime(null);
        setIsActive(false);
        setTimeLeft(selectedTime);
        setMistakes(0);
        setIsFinished(false);
        setAiTopic('');
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        throw new Error('No text generated');
      }
    } catch (err) {
      console.error('AI Error:', err);
      setAiError(err.message || 'Failed to generate text. Try again.');
    }
    setAiLoading(false);
  }, [aiTopic, selectedTime]);

  // Progress percentage
  const progress = text.length > 0 ? Math.round((input.length / text.length) * 100) : 0;

  // Render highlighted text
  const renderText = () => {
    return text.split('').map((char, i) => {
      let cls = 'char';
      if (i < input.length) {
        cls += input[i] === char ? ' correct' : ' incorrect';
      } else if (i === input.length) {
        cls += ' current';
      }
      return <span key={i} className={cls}>{char}</span>;
    });
  };

  return (
    <div className="tool-page typing-page">
      <div className="container">
        <motion.div className="tool-header" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="tool-icon-wrap"><Keyboard size={32} /></div>
          <h1>Typing Speed Test</h1>
          <p>Challenge yourself with random or AI-generated text.</p>
        </motion.div>

        {/* Top Controls Bar */}
        <motion.div
          className="typing-top-bar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="time-pills">
            {timeOptions.map(t => (
              <button
                key={t}
                className={`time-pill ${selectedTime === t ? 'active' : ''}`}
                onClick={() => { if (!isActive) { setSelectedTime(t); setTimeLeft(t); } }}
                disabled={isActive}
              >
                {t}s
              </button>
            ))}
          </div>

          <button className="new-test-btn" onClick={reset}>
            <RotateCcw size={15} /> New Test
          </button>
        </motion.div>

        {/* AI Generator */}
        <motion.div
          className="ai-generator"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="ai-row glass">
            <Sparkles size={18} className="ai-sparkle" />
            <input
              type="text"
              className="ai-topic-input"
              placeholder="Type a topic for AI text (e.g. space, coding, nature, sports)..."
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !aiLoading && generateAIText()}
              disabled={isActive || aiLoading}
            />
            <button
              className="ai-generate-btn"
              onClick={generateAIText}
              disabled={isActive || aiLoading || !aiTopic.trim()}
            >
              {aiLoading ? (
                <><span className="ai-spinner" /> Generating...</>
              ) : (
                <><Sparkles size={14} /> Generate</>
              )}
            </button>
          </div>
          <AnimatePresence>
            {aiError && (
              <motion.div
                className="ai-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle size={14} /> {aiError}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Live Stats Bar */}
        <motion.div
          className="stats-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <div className="stat-chip">
            <Zap size={15} />
            <span className="chip-value">{stats.wpm}</span>
            <span className="chip-label">WPM</span>
          </div>
          <div className="stat-chip">
            <Target size={15} />
            <span className="chip-value">{stats.accuracy}%</span>
            <span className="chip-label">Accuracy</span>
          </div>
          <div className="stat-chip error-chip">
            <span className="chip-value">{mistakes}</span>
            <span className="chip-label">Errors</span>
          </div>
          <div className="stat-chip timer-chip">
            <Clock size={15} />
            <span className="chip-value">{timeLeft}s</span>
            <span className="chip-label">Left</span>
          </div>
          <div className="stat-chip progress-chip">
            <span className="chip-value">{progress}%</span>
            <span className="chip-label">Done</span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="typing-progress-bar">
          <motion.div
            className="typing-progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Main Typing Area */}
        <motion.div
          className="typing-main glass-strong"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-display-area">
            {renderText()}
          </div>

          <div className="input-area">
            <textarea
              ref={inputRef}
              className="type-input"
              value={input}
              onChange={handleInput}
              placeholder={isFinished ? '✅ Test complete! Click New Test to try again.' : '👆 Click here and start typing to begin...'}
              disabled={isFinished}
              spellCheck={false}
              autoComplete="off"
              autoFocus
            />
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              className="results-panel glass-strong"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="results-header">
                <Trophy size={28} className="trophy-icon" />
                <h3>Test Complete!</h3>
              </div>

              <div className="results-stats">
                <div className="result-stat main-stat">
                  <span className="result-number">{stats.wpm}</span>
                  <span className="result-unit">WPM</span>
                </div>
                <div className="result-stat">
                  <span className="result-number">{stats.accuracy}%</span>
                  <span className="result-unit">Accuracy</span>
                </div>
                <div className="result-stat">
                  <span className="result-number">{stats.cpm}</span>
                  <span className="result-unit">CPM</span>
                </div>
                <div className="result-stat">
                  <span className="result-number">{mistakes}</span>
                  <span className="result-unit">Mistakes</span>
                </div>
              </div>

              <button className="btn-primary restart-btn" onClick={reset}>
                <RotateCcw size={16} /> Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Best Scores */}
        {bestScores.length > 0 && (
          <motion.div
            className="leaderboard glass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h4><Trophy size={16} /> Personal Best</h4>
            <div className="leaderboard-list">
              {bestScores.map((s, i) => (
                <div key={i} className="lb-row">
                  <span className="lb-rank">#{i + 1}</span>
                  <span className="lb-wpm">{s.wpm} WPM</span>
                  <span className="lb-acc">{s.accuracy}%</span>
                  <span className="lb-date">{s.date}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
