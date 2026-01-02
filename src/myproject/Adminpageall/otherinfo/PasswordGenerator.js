import React, { useState, useCallback, useMemo } from 'react';
import './PasswordGenerator.css';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [copyMessage, setCopyMessage] = useState('');
  const [customCharacters, setCustomCharacters] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [passwordCount, setPasswordCount] = useState(1);
  const [generatedPasswords, setGeneratedPasswords] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const characterSets = useMemo(() => ({
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()/\\\'"`~,;.<>'
  }), []);

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    if (!password || password.length === 0) return { score: 0, label: 'No Password', color: '#ccc', feedback: [] };
    
    let score = 0;
    let feedback = [];

    // Length scoring
    if (password.length >= 8) score += 25;
    else feedback.push('Use at least 8 characters');
    
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) feedback.push('Consider using 12+ characters');

    if (password.length >= 16) score += 10;

    // Character variety scoring
    if (/[a-z]/.test(password)) score += 10;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 10;
    else feedback.push('Add uppercase letters');
    
    if (/[0-9]/.test(password)) score += 10;
    else feedback.push('Add numbers');
    
    if (/[^a-zA-Z0-9]/.test(password)) score += 20;
    else feedback.push('Add special characters');

    // Bonus points for complexity
    const uniqueChars = new Set(password).size;
    if (uniqueChars / password.length > 0.7) score += 10;

    // Penalty for patterns
    if (/(.)\1{2,}/.test(password)) {
      score -= 10;
      feedback.push('Avoid repeating characters');
    }

    if (/123|abc|qwe/i.test(password)) {
      score -= 15;
      feedback.push('Avoid common sequences');
    }

    // Determine strength level
    let label, color;
    if (score < 30) {
      label = 'Very Weak';
      color = '#dc3545';
    } else if (score < 50) {
      label = 'Weak';
      color = '#fd7e14';
    } else if (score < 70) {
      label = 'Fair';
      color = '#ffc107';
    } else if (score < 90) {
      label = 'Good';
      color = '#28a745';
    } else {
      label = 'Excellent';
      color = '#007bff';
    }

    return { score: Math.min(100, Math.max(0, score)), label, color, feedback };
  }, [password]);

  // Generate character pool based on options
  const getCharacterPool = useCallback(() => {
    if (useCustom && customCharacters) {
      return customCharacters;
    }

    let pool = '';
    
    if (options.uppercase) pool += characterSets.uppercase;
    if (options.lowercase) pool += characterSets.lowercase;
    if (options.numbers) pool += characterSets.numbers;
    if (options.symbols) pool += characterSets.symbols;

    // Remove similar characters if option is enabled
    if (options.excludeSimilar) {
      pool = pool.split('').filter(char => !characterSets.similar.includes(char)).join('');
    }

    // Remove ambiguous characters if option is enabled
    if (options.excludeAmbiguous) {
      pool = pool.split('').filter(char => !characterSets.ambiguous.includes(char)).join('');
    }

    return pool;
  }, [options, characterSets, useCustom, customCharacters]);

  // Generate single password
  const generateSinglePassword = useCallback((targetLength = length) => {
    const pool = getCharacterPool();
    
    if (pool.length === 0) {
      return '';
    }

    let newPassword = '';
    
    if (!useCustom) {
      // Ensure at least one character from each selected type
      const requiredChars = [];
      if (options.uppercase) requiredChars.push(characterSets.uppercase[Math.floor(Math.random() * characterSets.uppercase.length)]);
      if (options.lowercase) requiredChars.push(characterSets.lowercase[Math.floor(Math.random() * characterSets.lowercase.length)]);
      if (options.numbers) requiredChars.push(characterSets.numbers[Math.floor(Math.random() * characterSets.numbers.length)]);
      if (options.symbols) requiredChars.push(characterSets.symbols[Math.floor(Math.random() * characterSets.symbols.length)]);

      // Add required characters
      for (let i = 0; i < Math.min(requiredChars.length, targetLength); i++) {
        newPassword += requiredChars[i];
      }
    }

    // Fill remaining length with random characters
    for (let i = newPassword.length; i < targetLength; i++) {
      newPassword += pool[Math.floor(Math.random() * pool.length)];
    }

    // Shuffle the password
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');

    return newPassword;
  }, [length, options, getCharacterPool, characterSets, useCustom]);

  // Generate password(s)
  const generatePassword = useCallback(() => {
    if (passwordCount === 1) {
      const newPassword = generateSinglePassword();
      setPassword(newPassword);
      setGeneratedPasswords([]);
      
      // Add to history
      if (newPassword) {
        setPasswordHistory(prev => {
          const newHistory = [newPassword, ...prev.filter(p => p !== newPassword)];
          return newHistory.slice(0, 10);
        });
      }
    } else {
      const passwords = [];
      for (let i = 0; i < passwordCount; i++) {
        passwords.push(generateSinglePassword());
      }
      setGeneratedPasswords(passwords);
      setPassword('');
    }
  }, [passwordCount, generateSinglePassword]);

  // Copy to clipboard
  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyMessage('Password copied!');
      setTimeout(() => setCopyMessage(''), 2000);
    });
  }, []);

  // Handle option change
  const handleOptionChange = useCallback((option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  }, []);

  // Generate password on component mount
  React.useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Password patterns for generation
  const generatePatternPassword = useCallback((pattern) => {
    let result = '';
    const patterns = {
      'word-number': () => {
        const words = ['secure', 'strong', 'power', 'magic', 'swift', 'bright', 'smart', 'quick'];
        const word = words[Math.floor(Math.random() * words.length)];
        const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return word.charAt(0).toUpperCase() + word.slice(1) + number + '!';
      },
      'memorable': () => {
        const adjectives = ['Happy', 'Sunny', 'Bright', 'Swift', 'Smart', 'Cool'];
        const nouns = ['Cat', 'Dog', 'Bird', 'Tree', 'Star', 'Moon'];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const num = Math.floor(Math.random() * 99) + 1;
        return `${adj}${noun}${num}!`;
      },
      'passphrase': () => {
        const words = ['correct', 'horse', 'battery', 'staple', 'mountain', 'river', 'ocean', 'forest'];
        const selectedWords = [];
        for (let i = 0; i < 4; i++) {
          selectedWords.push(words[Math.floor(Math.random() * words.length)]);
        }
        return selectedWords.join('-') + Math.floor(Math.random() * 99);
      }
    };

    result = patterns[pattern]();
    setPassword(result);
    
    // Add to history
    setPasswordHistory(prev => {
      const newHistory = [result, ...prev.filter(p => p !== result)];
      return newHistory.slice(0, 10);
    });
  }, []);

  return (
    <div className="password-generator-container">
      <div className="password-generator-header">
        <h1>🔐 Advanced Password Generator</h1>
        <p>Generate ultra-secure passwords with advanced customization</p>
      </div>

      {copyMessage && (
        <div className="copy-message">
          ✅ {copyMessage}
        </div>
      )}

      <div className="password-generator-main">
        <div className="password-section">
          {passwordCount === 1 ? (
            <div className="password-display">
              <div className="password-field">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="password-input"
                  placeholder="Generated password will appear here"
                />
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(password)}
                  disabled={!password}
                >
                  📋
                </button>
              </div>
              
              <div className="password-actions">
                <button 
                  className="generate-btn"
                  onClick={generatePassword}
                >
                  🎲 Generate Password
                </button>
              </div>
            </div>
          ) : (
            <div className="multiple-passwords">
              <h3>Generated Passwords ({passwordCount})</h3>
              <div className="passwords-list">
                {generatedPasswords.map((pwd, index) => (
                  <div key={index} className="password-item">
                    <span className="password-text">{pwd}</span>
                    <button 
                      className="copy-btn-small"
                      onClick={() => copyToClipboard(pwd)}
                    >
                      📋
                    </button>
                  </div>
                ))}
              </div>
              <button 
                className="generate-btn"
                onClick={generatePassword}
              >
                🎲 Generate {passwordCount} Passwords
              </button>
            </div>
          )}

          {password && passwordCount === 1 && (
            <div className="password-strength">
              <div className="strength-header">
                <h3>Password Strength</h3>
                <span 
                  className="strength-label"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="strength-bar">
                <div 
                  className="strength-fill"
                  style={{ 
                    width: `${passwordStrength.score}%`,
                    backgroundColor: passwordStrength.color
                  }}
                />
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="strength-feedback">
                  <h4>Suggestions:</h4>
                  <ul>
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="options-section">
          <h3>🛠️ Password Options</h3>
          
          <div className="length-control">
            <label>Password Length: {length}</label>
            <input
              type="range"
              min="4"
              max="128"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="length-slider"
            />
            <div className="length-labels">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          <div className="count-control">
            <label>Number of Passwords: {passwordCount}</label>
            <input
              type="range"
              min="1"
              max="20"
              value={passwordCount}
              onChange={(e) => setPasswordCount(parseInt(e.target.value))}
              className="count-slider"
            />
            <div className="count-labels">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          <div className="character-options">
            <h4>Character Types</h4>
            <div className="option-group">
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={() => handleOptionChange('uppercase')}
                  disabled={useCustom}
                />
                <span className="checkmark"></span>
                Uppercase Letters (A-Z)
              </label>
              
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={() => handleOptionChange('lowercase')}
                  disabled={useCustom}
                />
                <span className="checkmark"></span>
                Lowercase Letters (a-z)
              </label>
              
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={() => handleOptionChange('numbers')}
                  disabled={useCustom}
                />
                <span className="checkmark"></span>
                Numbers (0-9)
              </label>
              
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={() => handleOptionChange('symbols')}
                  disabled={useCustom}
                />
                <span className="checkmark"></span>
                Symbols (!@#$%^&*)
              </label>
            </div>

            <h4>Advanced Options</h4>
            <div className="option-group">
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={options.excludeSimilar}
                  onChange={() => handleOptionChange('excludeSimilar')}
                  disabled={useCustom}
                />
                <span className="checkmark"></span>
                Exclude Similar Characters (il1Lo0O)
              </label>
              
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={options.excludeAmbiguous}
                  onChange={() => handleOptionChange('excludeAmbiguous')}
                  disabled={useCustom}
                />
                <span className="checkmark"></span>
                Exclude Ambiguous Characters ({}[]()/\)
              </label>
            </div>

            <div className="custom-characters">
              <h4>Custom Character Set</h4>
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                />
                <span className="checkmark"></span>
                Use Custom Characters Only
              </label>
              <input
                type="text"
                value={customCharacters}
                onChange={(e) => setCustomCharacters(e.target.value)}
                placeholder="Enter custom characters..."
                className="custom-input"
                disabled={!useCustom}
              />
            </div>
          </div>

          <div className="pattern-passwords">
            <h4>🎯 Pattern-Based Passwords</h4>
            <div className="pattern-buttons">
              <button 
                className="pattern-btn"
                onClick={() => generatePatternPassword('word-number')}
              >
                Word + Number
              </button>
              <button 
                className="pattern-btn"
                onClick={() => generatePatternPassword('memorable')}
              >
                Memorable
              </button>
              <button 
                className="pattern-btn"
                onClick={() => generatePatternPassword('passphrase')}
              >
                Passphrase
              </button>
            </div>
          </div>

          <button 
            className="advanced-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '🔼' : '🔽'} Advanced Features
          </button>

          {showAdvanced && (
            <div className="advanced-features">
              <div className="password-analysis">
                <h4>📊 Password Analysis</h4>
                <div className="analysis-stats">
                  <div className="stat">
                    <span className="stat-label">Entropy:</span>
                    <span className="stat-value">{Math.round(Math.log2(Math.pow(getCharacterPool().length, length)))} bits</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Possible Combinations:</span>
                    <span className="stat-value">{getCharacterPool().length}^{length}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Time to Crack:</span>
                    <span className="stat-value">
                      {passwordStrength.score > 80 ? 'Centuries' : 
                       passwordStrength.score > 60 ? 'Years' : 
                       passwordStrength.score > 40 ? 'Months' : 'Days'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {passwordHistory.length > 0 && (
            <div className="password-history">
              <h4>📜 Recent Passwords</h4>
              <div className="history-list">
                {passwordHistory.map((pwd, index) => (
                  <div key={index} className="history-item">
                    <span className="history-password">{pwd}</span>
                    <button 
                      className="history-copy-btn"
                      onClick={() => copyToClipboard(pwd)}
                    >
                      📋
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="password-tips">
        <h3>🛡️ Password Security Tips</h3>
        <div className="tips-grid">
          <div className="tip-item">
            <span className="tip-icon">🔒</span>
            <div>
              <h4>Use Unique Passwords</h4>
              <p>Never reuse passwords across different accounts</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📱</span>
            <div>
              <h4>Enable 2FA</h4>
              <p>Add two-factor authentication for extra security</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🔄</span>
            <div>
              <h4>Regular Updates</h4>
              <p>Change passwords regularly, especially for important accounts</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">💾</span>
            <div>
              <h4>Use Password Manager</h4>
              <p>Store passwords securely with a password manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;