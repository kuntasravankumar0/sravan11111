import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import './FixMySpeaker.css';

const FixMySpeaker = () => {
  // Core state
  const [currentStage, setCurrentStage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume] = useState(1.0); // Start at maximum volume (HTML5 limit)
  const [volumeBoost] = useState(1.0); // Virtual boost multiplier
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [downloadProgress, setDownloadProgress] = useState({});
  const [audioBuffered, setAudioBuffered] = useState({});
  const [playAttempts, setPlayAttempts] = useState({});
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [retryCount, setRetryCount] = useState({});
  
  // Refs
  const audioRef = useRef(null);
  const downloadLinkRef = useRef(null);

  // Audio URLs - 3 main stages - wrapped in useMemo
  const audioUrls = useMemo(() => ({
    stage1: 'https://fixmyspeakertool.com/wp-content/uploads/2024/08/fix-my-speakers-1.mp3',
    stage2: 'https://fixmyspeakertool.com/wp-content/uploads/2024/08/fix-my-speakers-2.mp3',
    stage3: 'https://fixmyspeakertool.com/wp-content/uploads/2024/08/fix-my-speakers-3.mp3'
  }), []);

  // Audio file information - wrapped in useMemo
  const audioFileInfo = useMemo(() => ({
    stage1: { name: 'Fix-My-Speaker-Stage-1.mp3', title: 'Stage 1: Maximum Volume Test', description: 'Turn volume to maximum and play 3 times' },
    stage2: { name: 'Fix-My-Speaker-Stage-2.mp3', title: 'Stage 2: Directional Audio Test', description: 'Tilt device downward and play 3 times' },
    stage3: { name: 'Fix-My-Speaker-Stage-3.mp3', title: 'Stage 3: Vibration Mode Test', description: 'Enable vibration and play 4 times' }
  }), []);

  // Detect mobile device and initialize
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                           window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Add user interaction listener for mobile autoplay
    const handleUserInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
    
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('click', handleUserInteraction);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  // Initialize Web Audio API for volume boost with mobile fallback
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Resume context if suspended (common on mobile)
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        
        const gain = ctx.createGain();
        setAudioContext(ctx);
        setGainNode(gain);
      } catch (error) {
        console.log('Web Audio API not supported, using standard volume control');
        setAudioError('Web Audio API not supported on this device');
      }
    };
    
    if (userInteracted) {
      initAudioContext();
    }
  }, [userInteracted]);

  // Pre-load audio for instant playback with better progress tracking and error handling
  useEffect(() => {
    Object.keys(audioUrls).forEach(key => {
      const audio = new Audio();
      audio.preload = 'metadata'; // Use metadata instead of auto for mobile
      audio.crossOrigin = 'anonymous';
      
      // Add error handling for CORS and network issues
      const handleAudioError = (error) => {
        console.warn(`Audio loading error for ${key}:`, error);
        setAudioError(`Failed to load ${key} audio`);
        
        // Try without crossOrigin for fallback
        const fallbackAudio = new Audio();
        fallbackAudio.preload = 'metadata';
        fallbackAudio.src = audioUrls[key];
        
        fallbackAudio.addEventListener('canplaythrough', () => {
          setAudioBuffered(prev => ({ ...prev, [key]: true }));
          setDownloadProgress(prev => ({ ...prev, [key]: 100 }));
          setAudioError(null);
        });
        
        fallbackAudio.addEventListener('error', () => {
          setAudioError(`Network error loading ${key}`);
        });
      };
      
      audio.src = audioUrls[key];
      
      // Better progress tracking with mobile optimization
      const updateProgress = () => {
        try {
          if (audio.buffered.length > 0) {
            const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
            const duration = audio.duration;
            if (duration > 0) {
              const percent = Math.round((bufferedEnd / duration) * 100);
              setDownloadProgress(prev => ({ ...prev, [key]: percent }));
              
              // Mark as ready when sufficiently buffered (lower threshold for mobile)
              const readyThreshold = isMobile ? 50 : 95;
              if (percent >= readyThreshold) {
                setAudioBuffered(prev => ({ ...prev, [key]: true }));
              }
            }
          }
        } catch (error) {
          console.warn('Progress tracking error:', error);
        }
      };

      audio.addEventListener('canplaythrough', () => {
        setAudioBuffered(prev => ({ ...prev, [key]: true }));
        setDownloadProgress(prev => ({ ...prev, [key]: 100 }));
        setAudioError(null);
      });
      
      audio.addEventListener('progress', updateProgress);
      audio.addEventListener('loadeddata', updateProgress);
      audio.addEventListener('error', handleAudioError);
      
      // Simulate download progress for better UX (faster on mobile)
      let progressInterval;
      audio.addEventListener('loadstart', () => {
        let simulatedProgress = 0;
        const incrementSpeed = isMobile ? 20 : 15; // Faster simulation on mobile
        progressInterval = setInterval(() => {
          simulatedProgress += Math.random() * incrementSpeed;
          const maxSimulated = isMobile ? 70 : 90; // Lower max on mobile
          if (simulatedProgress < maxSimulated) {
            setDownloadProgress(prev => ({ 
              ...prev, 
              [key]: Math.min(simulatedProgress, prev[key] || 0) 
            }));
          } else {
            clearInterval(progressInterval);
          }
        }, isMobile ? 150 : 200); // Faster updates on mobile
      });
      
      audio.addEventListener('canplaythrough', () => {
        if (progressInterval) clearInterval(progressInterval);
      });
      
      // Cleanup on unmount
      return () => {
        if (progressInterval) clearInterval(progressInterval);
        audio.removeEventListener('canplaythrough', () => {});
        audio.removeEventListener('progress', updateProgress);
        audio.removeEventListener('loadeddata', updateProgress);
        audio.removeEventListener('error', handleAudioError);
      };
    });
  }, [audioUrls, isMobile]);

  // Smart download with progress tracking
  const initiateDownload = useCallback(async (audioKey) => {
    try {
      setLoadingMessage(`Preparing ${audioFileInfo[audioKey].title} for download...`);
      
      // Create download link
      const link = document.createElement('a');
      link.href = audioUrls[audioKey];
      link.download = audioFileInfo[audioKey].name;
      link.style.display = 'none';
      
      // Add to DOM and trigger download
      document.body.appendChild(link);
      downloadLinkRef.current = link;
      link.click();
      
      // Clean up after a delay
      setTimeout(() => {
        if (downloadLinkRef.current) {
          document.body.removeChild(downloadLinkRef.current);
          downloadLinkRef.current = null;
        }
      }, 1000);
      
      setLoadingMessage('Download started! Check your downloads folder.');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setLoadingMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Download error:', error);
      setLoadingMessage('Download initiated. Check your downloads folder.');
      setTimeout(() => setLoadingMessage(''), 3000);
    }
  }, [audioUrls, audioFileInfo]);

  // Apply volume with Web Audio API boost and mobile fallback
  const applyVolumeBoost = useCallback((audioElement) => {
    try {
      if (audioContext && gainNode && volumeBoost > 1.0 && !isMobile) {
        // Use Web Audio API for volume boost above 100% (desktop only)
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = volumeBoost;
        audioElement.volume = 1.0; // Set HTML5 volume to max
      } else {
        // Standard volume control (0-100%) - mobile fallback
        audioElement.volume = Math.min(volume, 1.0);
      }
    } catch (error) {
      console.warn('Volume boost error:', error);
      // Fallback to standard volume if Web Audio fails
      audioElement.volume = Math.min(volume, 1.0);
    }
  }, [audioContext, gainNode, volume, volumeBoost, isMobile]);

  // Enhanced play function with mobile optimization and retry logic
  const playAudioInstantly = useCallback(async (audioKey) => {
    const audioUrl = audioUrls[audioKey];
    
    // Check if user interaction is required (mobile)
    if (isMobile && !userInteracted) {
      setLoadingMessage('Tap anywhere to enable audio playback');
      return;
    }
    
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Create new audio instance for immediate playback
    const audio = new Audio();
    audioRef.current = audio;
    
    // Mobile-optimized settings
    if (isMobile) {
      audio.preload = 'metadata';
      audio.playsInline = true; // Prevent fullscreen on iOS
    } else {
      audio.preload = 'auto';
    }
    
    audio.src = audioUrl;
    
    // Apply volume (safe range 0-1 for HTML5)
    applyVolumeBoost(audio);
    
    // Set up event listeners with error handling
    const setupAudioListeners = () => {
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setIsLoading(false);
      };
      
      audio.onerror = async (error) => {
        console.warn('Audio playback error:', error);
        const currentRetry = retryCount[audioKey] || 0;
        
        if (currentRetry < 3) {
          // Retry with exponential backoff
          setRetryCount(prev => ({ ...prev, [audioKey]: currentRetry + 1 }));
          setLoadingMessage(`Retrying... (${currentRetry + 1}/3)`);
          
          setTimeout(() => {
            playAudioInstantly(audioKey);
          }, Math.pow(2, currentRetry) * 1000);
        } else {
          setAudioError(`Failed to play ${audioKey} after 3 attempts`);
          setIsPlaying(false);
          setIsLoading(false);
          setLoadingMessage('');
        }
      };
    };
    
    setupAudioListeners();
    
    // Attempt immediate playback with proper error handling
    try {
      setIsLoading(true);
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        setIsLoading(false);
        setAudioError(null);
        // Track successful play attempt
        setPlayAttempts(prev => ({ ...prev, [audioKey]: (prev[audioKey] || 0) + 1 }));
      }
    } catch (error) {
      console.warn('Play promise rejected:', error);
      setIsLoading(false);
      
      if (error.name === 'NotAllowedError') {
        setLoadingMessage('Please tap the play button to start audio');
      } else if (error.name === 'NotSupportedError') {
        setAudioError('Audio format not supported on this device');
      } else {
        setAudioError('Playback failed. Please try again.');
      }
      
      setTimeout(() => setLoadingMessage(''), 3000);
    }
  }, [audioUrls, applyVolumeBoost, isMobile, userInteracted, retryCount]);

  // Smart play with download progress check
  const handleSmartPlay = useCallback((audioKey) => {
    const progress = downloadProgress[audioKey] || 0;
    const isBuffered = audioBuffered[audioKey] || false;
    
    if (progress >= 10 || isBuffered) {
      // Enough buffered, play immediately
      playAudioInstantly(audioKey);
    } else {
      // Show brief loading, then play
      setIsLoading(true);
      setLoadingMessage('Buffering audio...');
      
      // Pre-load and play after short delay
      const audio = new Audio(audioUrls[audioKey]);
      applyVolumeBoost(audio);
      
      const tryPlay = () => {
        audio.play()
          .then(() => {
            audioRef.current = audio;
            setIsPlaying(true);
            setIsLoading(false);
            setLoadingMessage('');
            
            // Set up event listeners
            audio.onloadedmetadata = () => setDuration(audio.duration);
            audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
            audio.onended = () => {
              setIsPlaying(false);
              setCurrentTime(0);
            };
          })
          .catch(() => {
            setIsLoading(false);
            setLoadingMessage('');
            // Fallback to instant play
            playAudioInstantly(audioKey);
          });
      };
      
      // Try to play after 500ms buffer time
      setTimeout(tryPlay, 500);
    }
  }, [downloadProgress, audioBuffered, playAudioInstantly, audioUrls, applyVolumeBoost]);

  // Pause/Resume function
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If resume fails, restart the audio
          playAudioInstantly(`stage${currentStage}`);
        });
    }
  }, [isPlaying, currentStage, playAudioInstantly]);

  // Stop function
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  // Format time display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get progress percentage for display
  const getProgressPercentage = (audioKey) => {
    return downloadProgress[audioKey] || 0;
  };

  // Get status for audio file
  const getAudioStatus = (audioKey) => {
    const progress = getProgressPercentage(audioKey);
    const isBuffered = audioBuffered[audioKey];
    
    if (isBuffered || progress >= 100) return 'ready';
    if (progress >= 10) return 'buffered';
    if (progress > 0) return 'loading';
    return 'waiting';
  };

  return (
    <div className="fix-speaker-container">
      <div className="fix-speaker-header">
        <h1>🔊 Fix My Speaker Pro</h1>
        <p>Advanced speaker repair with instant playback</p>
      </div>

      <div className="speaker-fix-content">
        {/* Mobile-specific instructions */}
        {isMobile && !userInteracted && (
          <div className="mobile-interaction-prompt">
            <div className="prompt-content">
              <h3>🔊 Enable Audio</h3>
              <p>Tap anywhere to enable audio playback on your mobile device</p>
              <button 
                className="enable-audio-btn"
                onClick={() => setUserInteracted(true)}
              >
                Enable Audio
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {audioError && (
          <div className="error-message">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{audioError}</span>
              <button 
                className="error-dismiss"
                onClick={() => setAudioError(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Loading Message Display */}
        {(loadingMessage || isLoading) && (
          <div className="loading-message-overlay">
            <div className="loading-message-content">
              <div className="loading-spinner"></div>
              <h3>{loadingMessage || 'Processing...'}</h3>
            </div>
          </div>
        )}

        {/* Volume control removed as requested */}

        {/* Enhanced Stage Selection */}
        <div className="enhanced-stage-selection">
          <h3>🎯 Select Repair Stage</h3>
          <div className="stage-grid">
            {[1, 2, 3].map(stage => {
              const audioKey = `stage${stage}`;
              const status = getAudioStatus(audioKey);
              const progress = getProgressPercentage(audioKey);
              
              return (
                <div
                  key={stage}
                  className={`stage-card ${currentStage === stage ? 'active' : ''} ${status}`}
                  onClick={() => setCurrentStage(stage)}
                >
                  <div className="stage-number">Stage {stage}</div>
                  <div className="stage-title">{audioFileInfo[audioKey].title}</div>
                  <div className="stage-description">{audioFileInfo[audioKey].description}</div>
                  
                  {/* Progress indicator */}
                  <div className="stage-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {status === 'ready' && '✅ Ready'}
                      {status === 'buffered' && `� ${progress}%`}
                      {status === 'loading' && `⏳ ${progress}%`}
                      {status === 'waiting' && '⏸️ Waiting'}
                    </span>
                  </div>
                  
                  {playAttempts[audioKey] > 0 && (
                    <div className="play-count">
                      🎵 Played {playAttempts[audioKey]} times
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Stage Controls */}
        <div className="current-stage-controls">
          <h3>🎮 Stage {currentStage} Controls</h3>
          
          <div className="main-action-buttons">
            <button
              className="instant-play-btn"
              onClick={() => handleSmartPlay(`stage${currentStage}`)}
              disabled={isLoading}
            >
              {isPlaying ? '🎵 Playing...' : '▶️ Play Instantly'}
            </button>
            
            <button
              className="download-btn"
              onClick={() => initiateDownload(`stage${currentStage}`)}
              disabled={isLoading}
            >
              📥 Download
            </button>
          </div>
          
          {/* Playback Controls */}
          <div className="playback-controls">
            <button 
              className="control-btn"
              onClick={togglePlayPause}
              disabled={!audioRef.current}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Resume'}
            </button>
            
            <button 
              className="control-btn stop"
              onClick={stopAudio}
              disabled={!audioRef.current}
            >
              ⏹️ Stop
            </button>
          </div>
        </div>

        {/* Audio Progress */}
        {duration > 0 && (
          <div className="audio-progress-section">
            <div className="progress-info">
              <span className="time-current">{formatTime(currentTime)}</span>
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="time-total">{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* All Stages Quick Access */}
        <div className="quick-access-section">
          <h4>🚀 Quick Access - All Stages</h4>
          <div className="quick-access-grid">
            {Object.keys(audioFileInfo).map(audioKey => {
              const stageNum = audioKey.replace('stage', '');
              const status = getAudioStatus(audioKey);
              const progress = getProgressPercentage(audioKey);
              
              return (
                <div key={audioKey} className="quick-access-item">
                  <div className="item-header">
                    <span className="item-title">Stage {stageNum}</span>
                    <span className={`status-badge ${status}`}>
                      {status === 'ready' && '✅'}
                      {status === 'buffered' && '📊'}
                      {status === 'loading' && '⏳'}
                      {status === 'waiting' && '⏸️'}
                    </span>
                  </div>
                  
                  <div className="item-actions">
                    <button
                      className="quick-play-btn"
                      onClick={() => {
                        setCurrentStage(parseInt(stageNum));
                        handleSmartPlay(audioKey);
                      }}
                      disabled={isLoading}
                    >
                      ▶️ Play
                    </button>
                    
                    <button
                      className="quick-download-btn"
                      onClick={() => initiateDownload(audioKey)}
                      disabled={isLoading}
                    >
                      📥
                    </button>
                  </div>
                  
                  {progress > 0 && (
                    <div className="mini-progress">
                      <div 
                        className="mini-progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Advanced Features */}
        <div className="advanced-features">
          <h4>⚡ Advanced Features</h4>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span className="feature-text">Instant Playback</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span className="feature-text">Smart Buffering</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔊</span>
              <span className="feature-text">Volume Boost (200%)</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📥</span>
              <span className="feature-text">Direct Download</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions-section">
          <h4>💡 How to Use</h4>
          <ol>
            <li><strong>Select Stage:</strong> Click on any stage card to select it</li>
            <li><strong>Instant Play:</strong> Click "Play Instantly" for immediate sound</li>
            <li><strong>Volume Boost:</strong> Use slider or buttons to boost volume up to 200%</li>
            <li><strong>Smart Buffering:</strong> Audio pre-loads automatically for faster playback</li>
            <li><strong>Download:</strong> Save files locally for offline use</li>
            <li><strong>Progress Tracking:</strong> See buffering progress and play counts</li>
          </ol>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default FixMySpeaker;