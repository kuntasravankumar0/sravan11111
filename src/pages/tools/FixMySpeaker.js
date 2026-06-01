import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Play, Square, Download, AlertCircle, CheckCircle } from 'lucide-react';
import '../Tools.css';
import './FixMySpeaker.css';

const audioUrls = {
  stage1: 'https://fixmyspeakertool.com/wp-content/uploads/2024/08/fix-my-speakers-1.mp3',
  stage2: 'https://fixmyspeakertool.com/wp-content/uploads/2024/08/fix-my-speakers-2.mp3',
  stage3: 'https://fixmyspeakertool.com/wp-content/uploads/2024/08/fix-my-speakers-3.mp3',
};

const stages = [
  { id: 1, key: 'stage1', title: 'Stage 1: Low Frequency', desc: 'Turn volume to max. Play 3 times.', color: '#8b5cf6' },
  { id: 2, key: 'stage2', title: 'Stage 2: Mid Frequency', desc: 'Tilt device downward. Play 3 times.', color: '#6366f1' },
  { id: 3, key: 'stage3', title: 'Stage 3: High Frequency', desc: 'Enable vibration. Play 4 times.', color: '#3b82f6' },
];

export default function FixMySpeaker() {
  const [currentStage, setCurrentStage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playAttempts, setPlayAttempts] = useState({});
  const [error, setError] = useState(null);
  const [frequency, setFrequency] = useState(165);
  const [useBuiltIn, setUseBuiltIn] = useState(false);
  const audioRef = useRef(null);
  const oscRef = useRef(null);
  const ctxRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) { audioRef.current.pause(); }
      if (oscRef.current) { try { oscRef.current.stop(); } catch(e){} }
      if (ctxRef.current && ctxRef.current.state !== 'closed') { ctxRef.current.close(); }
    };
  }, []);

  const stopAll = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    if (oscRef.current) { try { oscRef.current.stop(); } catch(e){} oscRef.current = null; }
    if (ctxRef.current && ctxRef.current.state !== 'closed') { ctxRef.current.close(); ctxRef.current = null; }
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const playStage = useCallback(async (stageKey) => {
    stopAll();
    setError(null);

    if (useBuiltIn) {
      // Use Web Audio API oscillator
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') await ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        gain.gain.setValueAtTime(1, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        ctxRef.current = ctx;
        oscRef.current = osc;
        setIsPlaying(true);
        setPlayAttempts(prev => ({ ...prev, [stageKey]: (prev[stageKey] || 0) + 1 }));

        // Auto-stop after 30 seconds
        setTimeout(() => {
          try { osc.stop(); } catch(e){}
          ctx.close();
          setIsPlaying(false);
        }, 30000);
      } catch (err) {
        setError('Audio not supported on this device');
      }
      return;
    }

    // Use pre-recorded audio files
    try {
      const audio = new Audio(audioUrls[stageKey]);
      audio.volume = 1.0;
      audioRef.current = audio;

      audio.onloadedmetadata = () => setDuration(audio.duration);
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.onended = () => { setIsPlaying(false); setCurrentTime(0); };
      audio.onerror = () => setError('Failed to load audio. Try built-in mode.');

      await audio.play();
      setIsPlaying(true);
      setPlayAttempts(prev => ({ ...prev, [stageKey]: (prev[stageKey] || 0) + 1 }));
    } catch (err) {
      setError('Playback failed. Tap and try again.');
    }
  }, [stopAll, useBuiltIn, frequency]);

  const downloadAudio = (stageKey) => {
    const link = document.createElement('a');
    link.href = audioUrls[stageKey];
    link.download = `fix-speaker-${stageKey}.mp3`;
    link.click();
  };

  const formatTime = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  return (
    <div className="tool-page">
      <div className="container">
        <motion.div className="tool-header" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="tool-icon-wrap"><Volume2 size={32} /></div>
          <h1>Fix My Speaker Pro</h1>
          <p>Advanced speaker repair with sound vibrations to eject water and dust.</p>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div className="speaker-error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AlertCircle size={16} /> {error}
              <button onClick={() => setError(null)}>&times;</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Toggle */}
        <motion.div className="mode-toggle glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <button className={`mode-btn ${!useBuiltIn ? 'active' : ''}`} onClick={() => setUseBuiltIn(false)}>
            🎵 Audio Files
          </button>
          <button className={`mode-btn ${useBuiltIn ? 'active' : ''}`} onClick={() => setUseBuiltIn(true)}>
            🔊 Built-in Tone
          </button>
        </motion.div>

        {/* Frequency Control (built-in mode) */}
        {useBuiltIn && (
          <motion.div className="freq-section glass" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <label>Frequency: <strong>{frequency} Hz</strong></label>
            <input type="range" min="100" max="800" value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="freq-slider" />
            <div className="freq-presets">
              {[165, 300, 500, 700].map(f => (
                <button key={f} className={`preset-btn ${frequency === f ? 'active' : ''}`} onClick={() => setFrequency(f)}>{f}Hz</button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stage Cards */}
        <div className="stages-grid">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.id}
              className={`stage-card glass ${currentStage === stage.id ? 'active' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              onClick={() => { setCurrentStage(stage.id); stopAll(); }}
              whileHover={{ y: -4 }}
            >
              <div className="stage-indicator" style={{ background: stage.color }} />
              <h4>{stage.title}</h4>
              <p>{stage.desc}</p>
              {playAttempts[stage.key] > 0 && (
                <div className="play-count">
                  <CheckCircle size={12} /> Played {playAttempts[stage.key]}x
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Player */}
        <motion.div className="speaker-player glass-strong" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          {/* Visual */}
          <div className="speaker-visual-pro">
            <motion.div className="ring r1" animate={isPlaying ? { scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] } : {}} transition={{ duration: 1, repeat: Infinity }} />
            <motion.div className="ring r2" animate={isPlaying ? { scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] } : {}} transition={{ duration: 1.3, repeat: Infinity, delay: 0.2 }} />
            <motion.div className="ring r3" animate={isPlaying ? { scale: [1, 1.8, 1], opacity: [0.1, 0, 0.1] } : {}} transition={{ duration: 1.6, repeat: Infinity, delay: 0.4 }} />
            <div className="speaker-core-pro" style={{ background: stages[currentStage - 1].color }}>
              <Volume2 size={32} />
            </div>
          </div>

          {/* Progress */}
          {!useBuiltIn && duration > 0 && (
            <div className="audio-progress">
              <span>{formatTime(currentTime)}</span>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100}%`, background: stages[currentStage - 1].color }} />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          )}

          {/* Controls */}
          <div className="player-controls">
            {!isPlaying ? (
              <button className="play-btn-pro" onClick={() => playStage(`stage${currentStage}`)} style={{ background: stages[currentStage - 1].color }}>
                <Play size={20} /> Play Stage {currentStage}
              </button>
            ) : (
              <button className="stop-btn-pro" onClick={stopAll}>
                <Square size={20} /> Stop
              </button>
            )}
            {!useBuiltIn && (
              <button className="download-btn-pro" onClick={() => downloadAudio(`stage${currentStage}`)}>
                <Download size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div className="speaker-instructions glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <h4>💡 How to Use</h4>
          <ol>
            <li>Turn your device volume to <strong>maximum</strong></li>
            <li>Select a stage and press Play</li>
            <li>Hold device with speaker facing down</li>
            <li>Repeat each stage 3-4 times for best results</li>
            <li>Use built-in tone mode if audio files don't load</li>
          </ol>
        </motion.div>
      </div>
    </div>
  );
}
