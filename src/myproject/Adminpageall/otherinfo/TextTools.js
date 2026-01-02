import React, { useState, useCallback, useMemo } from 'react';
import './TextTools.css';

const TextTools = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeTab, setActiveTab] = useState('transform');
  const [copyMessage, setCopyMessage] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  // Auto-correct dictionary
  const autoCorrectDict = useMemo(() => ({
    // Common typos
    'teh': 'the',
    'adn': 'and',
    'recieve': 'receive',
    'seperate': 'separate',
    'definately': 'definitely',
    'occured': 'occurred',
    'accomodate': 'accommodate',
    'neccessary': 'necessary',
    'embarass': 'embarrass',
    'begining': 'beginning',
    'existance': 'existence',
    'independant': 'independent',
    'maintainance': 'maintenance',
    'occassion': 'occasion',
    'priviledge': 'privilege',
    'recomend': 'recommend',
    'succesful': 'successful',
    'tommorrow': 'tomorrow',
    'untill': 'until',
    'wich': 'which',
    'youre': "you're",
    'its': "it's",
    'dont': "don't",
    'cant': "can't",
    'wont': "won't",
    'shouldnt': "shouldn't",
    'couldnt': "couldn't",
    'wouldnt': "wouldn't",
    'isnt': "isn't",
    'arent': "aren't",
    'wasnt': "wasn't",
    'werent': "weren't",
    'hasnt': "hasn't",
    'havent': "haven't",
    'hadnt': "hadn't",
    'didnt': "didn't",
    'doesnt': "doesn't",
    // Grammar corrections
    'i': 'I',
    'im': "I'm",
    'ive': "I've",
    'ill': "I'll",
    'id': "I'd",
    // Common word corrections
    'alot': 'a lot',
    'alright': 'all right',
    'aswell': 'as well',
    'everytime': 'every time',
    'incase': 'in case',
    'infact': 'in fact',
    'inspite': 'in spite',
    'nevermind': 'never mind',
    'noone': 'no one',
    'someday': 'some day',
    'sometime': 'some time',
    'thankyou': 'thank you',
    'upto': 'up to',
    'eachother': 'each other',
    'everyday': 'every day',
    'everyone': 'every one',
    'everything': 'every thing',
    'everywhere': 'every where'
  }), []);

  // Text statistics
  const textStats = useMemo(() => {
    if (!inputText) return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      readingTime: 0,
      speakingTime: 0
    };

    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words / 200); // 200 WPM average reading speed
    const speakingTime = Math.ceil(words / 150); // 150 WPM average speaking speed

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime
    };
  }, [inputText]);

  // Auto-correct function
  const autoCorrectText = useCallback((text) => {
    let correctedText = text;
    
    // Apply auto-corrections
    Object.entries(autoCorrectDict).forEach(([wrong, correct]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      correctedText = correctedText.replace(regex, (match) => {
        // Preserve original case
        if (match === match.toUpperCase()) return correct.toUpperCase();
        if (match[0] === match[0].toUpperCase()) return correct.charAt(0).toUpperCase() + correct.slice(1);
        return correct;
      });
    });

    // Fix double spaces
    correctedText = correctedText.replace(/\s+/g, ' ');
    
    // Fix spacing around punctuation
    correctedText = correctedText.replace(/\s+([,.!?;:])/g, '$1');
    correctedText = correctedText.replace(/([.!?])\s*([A-Z])/g, '$1 $2');
    
    // Capitalize first letter of sentences
    correctedText = correctedText.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
    
    return correctedText;
  }, [autoCorrectDict]);

  // Text transformation functions
  const transformText = useCallback((type) => {
    let result = inputText;
    
    switch (type) {
      case 'uppercase':
        result = inputText.toUpperCase();
        break;
      case 'lowercase':
        result = inputText.toLowerCase();
        break;
      case 'titlecase':
        result = inputText.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'sentencecase':
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'alternatingcase':
        result = inputText.split('').map((char, index) => 
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        ).join('');
        break;
      case 'inversecase':
        result = inputText.split('').map(char => 
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        ).join('');
        break;
      case 'camelcase':
        result = inputText.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '');
        break;
      case 'pascalcase':
        result = inputText.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => 
          word.toUpperCase()
        ).replace(/\s+/g, '');
        break;
      case 'snakecase':
        result = inputText.toLowerCase().replace(/\s+/g, '_');
        break;
      case 'kebabcase':
        result = inputText.toLowerCase().replace(/\s+/g, '-');
        break;
      case 'reverse':
        result = inputText.split('').reverse().join('');
        break;
      case 'removeextraspaces':
        result = inputText.replace(/\s+/g, ' ').trim();
        break;
      case 'removeallspaces':
        result = inputText.replace(/\s/g, '');
        break;
      case 'addlinebreaks':
        result = inputText.replace(/\.\s+/g, '.\n');
        break;
      case 'removelinebreaks':
        result = inputText.replace(/\n/g, ' ').replace(/\s+/g, ' ');
        break;
      case 'autocorrect':
        result = autoCorrectText(inputText);
        break;
      default:
        result = inputText;
    }
    
    setOutputText(result);
  }, [inputText, autoCorrectText]);

  // Find and replace function
  const findAndReplace = useCallback(() => {
    if (!findText) return;
    
    let flags = 'g';
    if (!caseSensitive) flags += 'i';
    
    try {
      let regex;
      if (useRegex) {
        regex = new RegExp(findText, flags);
      } else {
        regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
      }
      
      const result = inputText.replace(regex, replaceText);
      setOutputText(result);
    } catch (error) {
      setOutputText('Invalid regular expression');
    }
  }, [inputText, findText, replaceText, caseSensitive, useRegex]);

  // Copy to clipboard
  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyMessage('Text copied!');
      setTimeout(() => setCopyMessage(''), 2000);
    });
  }, []);

  // Text formatting functions
  const formatText = useCallback((type) => {
    let result = inputText;
    
    switch (type) {
      case 'removepunctuation':
        result = inputText.replace(/[^\w\s]/g, '');
        break;
      case 'removenumbers':
        result = inputText.replace(/\d/g, '');
        break;
      case 'extractnumbers':
        result = inputText.match(/\d+/g)?.join(' ') || '';
        break;
      case 'extractemails':
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        result = inputText.match(emailRegex)?.join('\n') || 'No emails found';
        break;
      case 'extracturls':
        const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
        result = inputText.match(urlRegex)?.join('\n') || 'No URLs found';
        break;
      case 'sortlines':
        result = inputText.split('\n').sort().join('\n');
        break;
      case 'reverseorder':
        result = inputText.split('\n').reverse().join('\n');
        break;
      case 'removeduplicates':
        const lines = inputText.split('\n');
        result = [...new Set(lines)].join('\n');
        break;
      case 'numberedlist':
        result = inputText.split('\n').map((line, index) => 
          line.trim() ? `${index + 1}. ${line.trim()}` : line
        ).join('\n');
        break;
      case 'bulletlist':
        result = inputText.split('\n').map(line => 
          line.trim() ? `• ${line.trim()}` : line
        ).join('\n');
        break;
      default:
        result = inputText;
    }
    
    setOutputText(result);
  }, [inputText]);

  return (
    <div className="text-tools-container">
      <div className="text-tools-header">
        <h1>📝 Advanced Text Tools</h1>
        <p>Transform, analyze, and enhance your text with powerful tools</p>
      </div>

      {copyMessage && (
        <div className="copy-message">
          ✅ {copyMessage}
        </div>
      )}

      <div className="text-tools-main">
        <div className="input-section">
          <div className="input-header">
            <h3>📄 Input Text</h3>
            <div className="input-actions">
              <button 
                className="clear-btn"
                onClick={() => setInputText('')}
              >
                🗑️ Clear
              </button>
              <button 
                className="paste-btn"
                onClick={() => navigator.clipboard.readText().then(setInputText)}
              >
                📋 Paste
              </button>
            </div>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here..."
            className="text-input"
            rows={10}
          />
          
          <div className="text-stats">
            <div className="stat-item">
              <span className="stat-value">{textStats.characters}</span>
              <span className="stat-label">Characters</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{textStats.charactersNoSpaces}</span>
              <span className="stat-label">No Spaces</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{textStats.words}</span>
              <span className="stat-label">Words</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{textStats.sentences}</span>
              <span className="stat-label">Sentences</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{textStats.paragraphs}</span>
              <span className="stat-label">Paragraphs</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{textStats.readingTime}m</span>
              <span className="stat-label">Read Time</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{textStats.speakingTime}m</span>
              <span className="stat-label">Speak Time</span>
            </div>
          </div>
        </div>

        <div className="tools-section">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'transform' ? 'active' : ''}`}
              onClick={() => setActiveTab('transform')}
            >
              🔄 Transform
            </button>
            <button 
              className={`tab ${activeTab === 'findreplace' ? 'active' : ''}`}
              onClick={() => setActiveTab('findreplace')}
            >
              🔍 Find & Replace
            </button>
            <button 
              className={`tab ${activeTab === 'format' ? 'active' : ''}`}
              onClick={() => setActiveTab('format')}
            >
              ✨ Format
            </button>
            <button 
              className={`tab ${activeTab === 'autocorrect' ? 'active' : ''}`}
              onClick={() => setActiveTab('autocorrect')}
            >
              🔧 Auto-Correct
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'transform' && (
              <div className="transform-tools">
                <h4>Text Case Transformations</h4>
                <div className="tool-buttons">
                  <button onClick={() => transformText('uppercase')}>UPPERCASE</button>
                  <button onClick={() => transformText('lowercase')}>lowercase</button>
                  <button onClick={() => transformText('titlecase')}>Title Case</button>
                  <button onClick={() => transformText('sentencecase')}>Sentence case</button>
                  <button onClick={() => transformText('alternatingcase')}>aLtErNaTiNg CaSe</button>
                  <button onClick={() => transformText('inversecase')}>iNVERSE cASE</button>
                  <button onClick={() => transformText('camelcase')}>camelCase</button>
                  <button onClick={() => transformText('pascalcase')}>PascalCase</button>
                  <button onClick={() => transformText('snakecase')}>snake_case</button>
                  <button onClick={() => transformText('kebabcase')}>kebab-case</button>
                </div>
                
                <h4>Text Modifications</h4>
                <div className="tool-buttons">
                  <button onClick={() => transformText('reverse')}>🔄 Reverse Text</button>
                  <button onClick={() => transformText('removeextraspaces')}>🧹 Remove Extra Spaces</button>
                  <button onClick={() => transformText('removeallspaces')}>🚫 Remove All Spaces</button>
                  <button onClick={() => transformText('addlinebreaks')}>↩️ Add Line Breaks</button>
                  <button onClick={() => transformText('removelinebreaks')}>➡️ Remove Line Breaks</button>
                </div>
              </div>
            )}

            {activeTab === 'findreplace' && (
              <div className="find-replace-tools">
                <div className="find-replace-inputs">
                  <div className="input-group">
                    <label>Find:</label>
                    <input
                      type="text"
                      value={findText}
                      onChange={(e) => setFindText(e.target.value)}
                      placeholder="Text to find..."
                    />
                  </div>
                  <div className="input-group">
                    <label>Replace with:</label>
                    <input
                      type="text"
                      value={replaceText}
                      onChange={(e) => setReplaceText(e.target.value)}
                      placeholder="Replacement text..."
                    />
                  </div>
                </div>
                
                <div className="find-replace-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={caseSensitive}
                      onChange={(e) => setCaseSensitive(e.target.checked)}
                    />
                    Case Sensitive
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={useRegex}
                      onChange={(e) => setUseRegex(e.target.checked)}
                    />
                    Use Regular Expression
                  </label>
                </div>
                
                <button className="replace-btn" onClick={findAndReplace}>
                  🔄 Replace All
                </button>
              </div>
            )}

            {activeTab === 'format' && (
              <div className="format-tools">
                <h4>Text Cleaning</h4>
                <div className="tool-buttons">
                  <button onClick={() => formatText('removepunctuation')}>Remove Punctuation</button>
                  <button onClick={() => formatText('removenumbers')}>Remove Numbers</button>
                  <button onClick={() => formatText('extractnumbers')}>Extract Numbers</button>
                  <button onClick={() => formatText('extractemails')}>Extract Emails</button>
                  <button onClick={() => formatText('extracturls')}>Extract URLs</button>
                </div>
                
                <h4>List Operations</h4>
                <div className="tool-buttons">
                  <button onClick={() => formatText('sortlines')}>📊 Sort Lines</button>
                  <button onClick={() => formatText('reverseorder')}>🔄 Reverse Order</button>
                  <button onClick={() => formatText('removeduplicates')}>🗑️ Remove Duplicates</button>
                  <button onClick={() => formatText('numberedlist')}>🔢 Numbered List</button>
                  <button onClick={() => formatText('bulletlist')}>• Bullet List</button>
                </div>
              </div>
            )}

            {activeTab === 'autocorrect' && (
              <div className="autocorrect-tools">
                <div className="autocorrect-info">
                  <h4>🔧 Auto-Correct Features</h4>
                  <p>Automatically fixes common spelling mistakes, grammar errors, and formatting issues:</p>
                  <ul>
                    <li>✅ Common typos (teh → the, recieve → receive)</li>
                    <li>✅ Contractions (dont → don't, cant → can't)</li>
                    <li>✅ Capitalization (i → I, sentence beginnings)</li>
                    <li>✅ Spacing issues (double spaces, punctuation)</li>
                    <li>✅ Common word corrections (alot → a lot)</li>
                  </ul>
                </div>
                
                <button 
                  className="autocorrect-btn"
                  onClick={() => transformText('autocorrect')}
                >
                  🔧 Auto-Correct Text
                </button>
                
                <div className="corrections-preview">
                  <h5>Sample Corrections:</h5>
                  <div className="correction-examples">
                    <div className="correction-item">
                      <span className="before">teh quick brown fox</span>
                      <span className="arrow">→</span>
                      <span className="after">the quick brown fox</span>
                    </div>
                    <div className="correction-item">
                      <span className="before">i dont think its right</span>
                      <span className="arrow">→</span>
                      <span className="after">I don't think it's right</span>
                    </div>
                    <div className="correction-item">
                      <span className="before">alot of  people</span>
                      <span className="arrow">→</span>
                      <span className="after">a lot of people</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="output-section">
          <div className="output-header">
            <h3>📋 Output Text</h3>
            <div className="output-actions">
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(outputText)}
                disabled={!outputText}
              >
                📋 Copy
              </button>
              <button 
                className="use-output-btn"
                onClick={() => setInputText(outputText)}
                disabled={!outputText}
              >
                ↩️ Use as Input
              </button>
            </div>
          </div>
          <textarea
            value={outputText}
            readOnly
            placeholder="Transformed text will appear here..."
            className="text-output"
            rows={10}
          />
        </div>
      </div>
    </div>
  );
};

export default TextTools;