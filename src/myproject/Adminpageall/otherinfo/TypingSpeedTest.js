import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './TypingSpeedTest.css';

const TypingSpeedTest = () => {
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedTime, setSelectedTime] = useState(60);
  const [mistakes, setMistakes] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bestScores, setBestScores] = useState([]);
  const [customText, setCustomText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [paragraphCount, setParagraphCount] = useState(3);
  const [textSource, setTextSource] = useState('predefined');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample texts for typing practice
  const sampleTexts = useMemo(() => [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice.",
    "Technology has revolutionized the way we communicate, work, and live. From smartphones to artificial intelligence, innovation continues to shape our future.",
    "Learning to type efficiently is a valuable skill in today's digital world. Practice makes perfect, and consistency is key to improvement.",
    "Programming requires attention to detail, logical thinking, and problem-solving skills. Every line of code serves a purpose in creating software solutions.",
    "The internet has connected people across the globe, enabling instant communication and access to vast amounts of information at our fingertips.",
    "Artificial intelligence and machine learning are transforming industries, from healthcare to transportation, creating new possibilities for human advancement.",
    "Climate change is one of the most pressing challenges of our time, requiring global cooperation and innovative solutions to protect our planet.",
    "Education is the foundation of progress, empowering individuals with knowledge and skills to contribute meaningfully to society and their communities."
  ], []);

  // Text generation templates
  const textTemplates = useMemo(() => ({
    technology: [
      "The rapid advancement of technology has transformed every aspect of modern life.",
      "Artificial intelligence is reshaping industries and creating new opportunities for innovation.",
      "Cloud computing has revolutionized how businesses store and process data.",
      "Mobile devices have become essential tools for communication and productivity.",
      "Cybersecurity remains a critical concern in our increasingly connected world."
    ],
    nature: [
      "The natural world displays incredible diversity in its ecosystems and wildlife.",
      "Climate patterns are changing due to human activities and natural variations.",
      "Forests play a crucial role in maintaining the planet's ecological balance.",
      "Ocean currents influence weather patterns across the globe.",
      "Biodiversity is essential for maintaining healthy and resilient ecosystems."
    ],
    science: [
      "Scientific research continues to unlock the mysteries of the universe.",
      "Medical breakthroughs are extending human lifespan and improving quality of life.",
      "Physics helps us understand the fundamental laws governing matter and energy.",
      "Chemistry reveals how atoms and molecules interact to form complex structures.",
      "Biology explores the intricate mechanisms of life at all scales."
    ],
    business: [
      "Successful businesses adapt quickly to changing market conditions.",
      "Customer satisfaction is the cornerstone of sustainable business growth.",
      "Innovation drives competitive advantage in today's global marketplace.",
      "Effective leadership inspires teams to achieve extraordinary results.",
      "Strategic planning helps organizations navigate uncertainty and achieve their goals."
    ]
  }), []);

  // Load best scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem('typingSpeedBestScores');
    if (savedScores) {
      setBestScores(JSON.parse(savedScores));
    }
  }, []);

  // Generate large paragraph text
  const generateLargeText = useCallback((topic = 'mixed', paragraphs = 3) => {
    setIsGenerating(true);
    
    setTimeout(() => {
      let generatedContent = '';
      const topics = topic === 'mixed' ? Object.keys(textTemplates) : [topic];
      
      for (let i = 0; i < paragraphs; i++) {
        const selectedTopic = topics[Math.floor(Math.random() * topics.length)];
        const sentences = textTemplates[selectedTopic];
        
        // Generate 4-6 sentences per paragraph
        const sentenceCount = Math.floor(Math.random() * 3) + 4;
        let paragraph = '';
        
        for (let j = 0; j < sentenceCount; j++) {
          const sentence = sentences[Math.floor(Math.random() * sentences.length)];
          paragraph += sentence + ' ';
        }
        
        generatedContent += paragraph.trim() + '\n\n';
      }
      
      setGeneratedText(generatedContent.trim());
      setTextSource('generated');
      setCurrentText(generatedContent.trim());
      setIsGenerating(false);
    }, 1000);
  }, [textTemplates]);

  // Search for text content (simulated)
  const searchForText = useCallback(async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: `${query} - Introduction`,
          content: `${query} is a fascinating topic that has captured the attention of researchers and enthusiasts worldwide. This comprehensive overview explores the fundamental concepts and practical applications that make ${query} so important in today's world. Understanding ${query} requires careful study and practice to master its intricacies and develop proficiency.`
        },
        {
          id: 2,
          title: `Advanced ${query} Concepts`,
          content: `Building upon the basic principles of ${query}, we delve into more complex theories and methodologies. Advanced practitioners of ${query} often develop specialized techniques that enhance their effectiveness. The evolution of ${query} continues to shape modern approaches and innovative solutions across various fields.`
        },
        {
          id: 3,
          title: `${query} in Practice`,
          content: `Real-world applications of ${query} demonstrate its versatility and importance across various industries. Professionals who master ${query} find themselves well-equipped to tackle complex challenges. The practical implementation of ${query} principles yields measurable results and sustainable outcomes for organizations.`
        }
      ];
      
      setSearchResults(mockResults);
      setTextSource('search');
      setIsSearching(false);
    }, 1500);
  }, []);

  // Finish test and calculate results
  const finishTest = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      
      // Calculate results
      const timeElapsed = (selectedTime - timeLeft) / 60; // in minutes
      const wordsTyped = userInput.trim().split(' ').length;
      const wpm = Math.round(wordsTyped / timeElapsed) || 0;
      const accuracy = Math.round(((userInput.length - mistakes) / userInput.length) * 100) || 0;
      
      // Save best score
      const newScore = {
        wpm,
        accuracy,
        date: new Date().toLocaleDateString(),
        time: selectedTime,
        mistakes
      };
      
      const updatedScores = [...bestScores, newScore]
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 10);
      
      setBestScores(updatedScores);
      localStorage.setItem('typingSpeedBestScores', JSON.stringify(updatedScores));
      
      // Auto-generate new random text after 3 seconds
      setTimeout(() => {
        // Reset to predefined mode and select random text
        setTextSource('predefined');
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        setCurrentText(randomText);
        setUserInput('');
        setStartTime(null);
        setIsActive(false);
        setTimeLeft(selectedTime);
        setMistakes(0);
        setCurrentIndex(0);
      }, 3000);
    }
  }, [isActive, selectedTime, timeLeft, userInput, mistakes, bestScores, sampleTexts]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      finishTest();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, finishTest]);

  // Initialize new test
  const startNewTest = useCallback(() => {
    let textToUse = '';
    
    switch (textSource) {
      case 'custom':
        textToUse = customText || sampleTexts[0];
        break;
      case 'search':
        textToUse = searchResults.length > 0 ? searchResults[0].content : sampleTexts[0];
        break;
      case 'generated':
        textToUse = generatedText || sampleTexts[0];
        break;
      default:
        textToUse = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    }
    
    setCurrentText(textToUse);
    setUserInput('');
    setStartTime(null);
    setIsActive(false);
    setTimeLeft(selectedTime);
    setMistakes(0);
    setCurrentIndex(0);
  }, [sampleTexts, selectedTime, textSource, customText, searchResults, generatedText]);

  // Start typing test
  const startTest = useCallback(() => {
    if (!isActive && userInput === '') {
      setStartTime(Date.now());
      setIsActive(true);
    }
  }, [isActive, userInput]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    
    if (!isActive && value.length === 1) {
      startTest();
    }
    
    if (isActive) {
      setUserInput(value);
      
      // Calculate mistakes and current position
      let newMistakes = 0;
      let newCurrentIndex = 0;
      
      for (let i = 0; i < value.length; i++) {
        if (i < currentText.length) {
          if (value[i] !== currentText[i]) {
            newMistakes++;
          }
          newCurrentIndex = i + 1;
        }
      }
      
      setMistakes(newMistakes);
      setCurrentIndex(newCurrentIndex);
      
      // Check if test is complete
      if (value.length >= currentText.length) {
        finishTest();
      }
    }
  }, [isActive, currentText, startTest, finishTest]);

  // Calculate real-time stats
  const currentStats = useMemo(() => {
    if (!isActive || !startTime) {
      return { wpm: 0, accuracy: 0 };
    }
    
    const timeElapsed = (selectedTime - timeLeft) / 60; // in minutes
    const wordsTyped = userInput.trim().split(' ').length;
    const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    const accuracy = userInput.length > 0 ? Math.round(((userInput.length - mistakes) / userInput.length) * 100) : 100;
    
    return { wpm, accuracy };
  }, [isActive, startTime, selectedTime, timeLeft, userInput, mistakes]);

  // Render text with enhanced highlighting
  const renderText = () => {
    const textToRender = currentText || sampleTexts[0];
    return textToRender.split('').map((char, index) => {
      let className = 'char';
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className += ' correct';
        } else {
          className += ' incorrect';
        }
      } else if (index === currentIndex) {
        className += ' current';
      } else if (index < currentIndex) {
        className += ' pending';
      }
      
      return (
        <span key={index} className={className}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  // Initialize test on component mount
  useEffect(() => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setCurrentText(randomText);
    setUserInput('');
    setStartTime(null);
    setIsActive(false);
    setTimeLeft(selectedTime);
    setMistakes(0);
    setCurrentIndex(0);
  }, [sampleTexts, selectedTime]);

  return (
    <div className="typing-speed-test-container">
      <div className="typing-test-header">
        <h1>⌨️ Advanced Typing Speed Test</h1>
        <p>Test your typing speed with custom text, search, and generation features</p>
      </div>

      <div className="test-controls">
        <div className="time-selector">
          <label>Test Duration:</label>
          <select 
            value={selectedTime} 
            onChange={(e) => setSelectedTime(parseInt(e.target.value))}
            disabled={isActive}
          >
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={300}>5 minutes</option>
          </select>
        </div>
        
        <button 
          className="new-test-btn"
          onClick={startNewTest}
          disabled={isActive}
        >
          🔄 New Test
        </button>
      </div>

      <div className="text-source-controls">
        <div className="source-tabs">
          <button 
            className={`source-tab ${textSource === 'predefined' ? 'active' : ''}`}
            onClick={() => setTextSource('predefined')}
            disabled={isActive}
          >
            📚 Predefined
          </button>
          <button 
            className={`source-tab ${textSource === 'custom' ? 'active' : ''}`}
            onClick={() => setTextSource('custom')}
            disabled={isActive}
          >
            ✏️ Custom
          </button>
          <button 
            className={`source-tab ${textSource === 'search' ? 'active' : ''}`}
            onClick={() => setTextSource('search')}
            disabled={isActive}
          >
            🔍 Search
          </button>
          <button 
            className={`source-tab ${textSource === 'generated' ? 'active' : ''}`}
            onClick={() => setTextSource('generated')}
            disabled={isActive}
          >
            🤖 Generate
          </button>
        </div>

        {textSource === 'custom' && (
          <div className="custom-text-section">
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Enter your custom text here..."
              className="custom-text-input"
              rows={4}
              disabled={isActive}
            />
            <button 
              className="apply-custom-btn"
              onClick={() => {
                if (customText.trim()) {
                  setCurrentText(customText);
                }
              }}
              disabled={isActive || !customText.trim()}
            >
              Apply Custom Text
            </button>
          </div>
        )}

        {textSource === 'search' && (
          <div className="search-section">
            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for text content (e.g., 'programming', 'science', 'history')"
                className="search-input"
                disabled={isActive || isSearching}
                onKeyPress={(e) => e.key === 'Enter' && searchForText(searchQuery)}
              />
              <button 
                className="search-btn"
                onClick={() => searchForText(searchQuery)}
                disabled={isActive || isSearching || !searchQuery.trim()}
              >
                {isSearching ? '🔄' : '🔍'} {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="search-results">
                <h4>Search Results:</h4>
                {searchResults.map((result) => (
                  <div key={result.id} className="search-result-item">
                    <h5>{result.title}</h5>
                    <p>{result.content.substring(0, 150)}...</p>
                    <button 
                      className="use-result-btn"
                      onClick={() => setCurrentText(result.content)}
                      disabled={isActive}
                    >
                      Use This Text
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {textSource === 'generated' && (
          <div className="generate-section">
            <div className="generate-controls">
              <div className="control-group">
                <label>Topic:</label>
                <select className="topic-select">
                  <option value="mixed">Mixed Topics</option>
                  <option value="technology">Technology</option>
                  <option value="nature">Nature</option>
                  <option value="science">Science</option>
                  <option value="business">Business</option>
                </select>
              </div>
              
              <div className="control-group">
                <label>Paragraphs: {paragraphCount}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={paragraphCount}
                  onChange={(e) => setParagraphCount(parseInt(e.target.value))}
                  className="paragraph-slider"
                  disabled={isActive}
                />
              </div>
            </div>
            
            <button 
              className="generate-btn"
              onClick={() => generateLargeText('mixed', paragraphCount)}
              disabled={isActive || isGenerating}
            >
              {isGenerating ? '🔄 Generating...' : '🤖 Generate Text'}
            </button>
            
            {generatedText && (
              <div className="generated-preview">
                <h4>Generated Text Preview:</h4>
                <div className="preview-text">
                  {generatedText.substring(0, 200)}...
                </div>
                <button 
                  className="use-generated-btn"
                  onClick={() => setCurrentText(generatedText)}
                  disabled={isActive}
                >
                  Use Generated Text
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="stats-display">
        <div className="stat-item">
          <div className="stat-value">{currentStats.wpm}</div>
          <div className="stat-label">WPM</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{currentStats.accuracy}%</div>
          <div className="stat-label">Accuracy</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{mistakes}</div>
          <div className="stat-label">Mistakes</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{timeLeft}s</div>
          <div className="stat-label">Time Left</div>
        </div>
      </div>

      <div className="typing-area">
        <div className="text-display">
          {renderText()}
        </div>
        
        <textarea
          className="typing-input"
          value={userInput}
          onChange={handleInputChange}
          placeholder={isActive ? "Keep typing..." : "Click here and start typing to begin the test"}
          disabled={timeLeft === 0}
          autoFocus
        />
      </div>

      {timeLeft === 0 && (
        <div className="test-results">
          <h3>🎉 Test Complete!</h3>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Words Per Minute:</span>
              <span className="result-value">{currentStats.wpm} WPM</span>
            </div>
            <div className="result-item">
              <span className="result-label">Accuracy:</span>
              <span className="result-value">{currentStats.accuracy}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Mistakes:</span>
              <span className="result-value">{mistakes}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Characters Typed:</span>
              <span className="result-value">{userInput.length}</span>
            </div>
          </div>
          <div className="next-test-info">
            <p>🔄 New random text will load automatically in 3 seconds...</p>
            <button 
              className="start-new-btn"
              onClick={startNewTest}
            >
              🚀 Start New Test Now
            </button>
          </div>
        </div>
      )}

      {bestScores.length > 0 && (
        <div className="best-scores">
          <h3>🏆 Best Scores</h3>
          <div className="scores-table">
            <div className="scores-header">
              <span>Rank</span>
              <span>WPM</span>
              <span>Accuracy</span>
              <span>Date</span>
              <span>Duration</span>
            </div>
            {bestScores.slice(0, 5).map((score, index) => (
              <div key={index} className="score-row">
                <span>#{index + 1}</span>
                <span>{score.wpm}</span>
                <span>{score.accuracy}%</span>
                <span>{score.date}</span>
                <span>{score.time}s</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="typing-tips">
        <h3>💡 Typing Tips</h3>
        <div className="tips-grid">
          <div className="tip-item">
            <span className="tip-icon">👀</span>
            <div>
              <h4>Look at the Screen</h4>
              <p>Don't look at your keyboard while typing</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">✋</span>
            <div>
              <h4>Proper Hand Position</h4>
              <p>Keep your fingers on the home row keys</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🎯</span>
            <div>
              <h4>Focus on Accuracy</h4>
              <p>Speed will come naturally with practice</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">⏰</span>
            <div>
              <h4>Practice Regularly</h4>
              <p>Consistent practice improves muscle memory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingSpeedTest;