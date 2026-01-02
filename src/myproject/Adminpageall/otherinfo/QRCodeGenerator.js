import React, { useState, useCallback } from 'react';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [size, setSize] = useState(200);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [format, setFormat] = useState('PNG');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [borderSize, setBorderSize] = useState(4);
  const [history, setHistory] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [batchTexts, setBatchTexts] = useState(['']);
  const [batchQRCodes, setBatchQRCodes] = useState([]);
  const [showBatchResults, setShowBatchResults] = useState(false);

  // Generate QR Code using QR Server API with advanced options
  const generateQRCode = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter text to generate QR code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Using QR Server API with advanced parameters
      const encodedText = encodeURIComponent(text);
      const bgColor = backgroundColor.replace('#', '');
      const fgColor = foregroundColor.replace('#', '');
      
      let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&ecc=${errorCorrection}&bgcolor=${bgColor}&color=${fgColor}&margin=${borderSize}`;
      
      if (format === 'SVG') {
        qrUrl += '&format=svg';
      }
      
      // Test if the URL is accessible
      const img = new Image();
      img.onload = () => {
        setQrCodeUrl(qrUrl);
        setIsLoading(false);
        
        // Add to history
        const historyItem = {
          id: Date.now(),
          text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
          url: qrUrl,
          timestamp: new Date().toLocaleTimeString(),
          size,
          errorCorrection,
          format
        };
        setHistory(prev => [historyItem, ...prev.slice(0, 9)]);
      };
      img.onerror = () => {
        setError('Failed to generate QR code. Please try again.');
        setIsLoading(false);
      };
      img.src = qrUrl;
      
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      setIsLoading(false);
    }
  }, [text, size, errorCorrection, format, backgroundColor, foregroundColor, borderSize]);

  // Download QR Code
  const downloadQRCode = useCallback(async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${Date.now()}.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download QR code');
    }
  }, [qrCodeUrl, format]);

  // Batch generate QR codes
  const generateBatchQRCodes = useCallback(async () => {
    const validTexts = batchTexts.filter(t => t.trim());
    if (validTexts.length === 0) {
      setError('Please enter at least one text for batch generation');
      return;
    }

    setIsLoading(true);
    setError('');
    setBatchQRCodes([]);
    setShowBatchResults(false);

    try {
      const qrCodes = [];
      
      for (let i = 0; i < validTexts.length; i++) {
        const batchText = validTexts[i];
        const encodedText = encodeURIComponent(batchText);
        const bgColor = backgroundColor.replace('#', '');
        const fgColor = foregroundColor.replace('#', '');
        
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&ecc=${errorCorrection}&bgcolor=${bgColor}&color=${fgColor}&margin=${borderSize}`;
        
        qrCodes.push({
          id: i + 1,
          text: batchText,
          url: qrUrl,
          filename: `qr-code-${i + 1}-${batchText.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.png`
        });
      }
      
      setBatchQRCodes(qrCodes);
      setShowBatchResults(true);
      setIsLoading(false);
      
      // Add batch to history
      const historyItem = {
        id: Date.now(),
        text: `Batch: ${validTexts.length} QR codes`,
        url: '',
        timestamp: new Date().toLocaleTimeString(),
        size,
        errorCorrection,
        format: 'PNG'
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]);
      
    } catch (err) {
      setError('Failed to generate batch QR codes');
      setIsLoading(false);
    }
  }, [batchTexts, size, errorCorrection, backgroundColor, foregroundColor, borderSize]);

  // Download individual QR code from batch
  const downloadBatchQRCode = useCallback(async (qrCode) => {
    try {
      const response = await fetch(qrCode.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = qrCode.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download QR code');
    }
  }, []);

  // Download all batch QR codes as ZIP (simplified approach)
  const downloadAllBatchQRCodes = useCallback(async () => {
    try {
      for (let i = 0; i < batchQRCodes.length; i++) {
        const qrCode = batchQRCodes[i];
        await downloadBatchQRCode(qrCode);
        
        // Add small delay between downloads
        if (i < batchQRCodes.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (err) {
      setError('Failed to download all QR codes');
    }
  }, [batchQRCodes, downloadBatchQRCode]);

  // Add batch text input
  const addBatchInput = useCallback(() => {
    setBatchTexts(prev => [...prev, '']);
  }, []);

  // Remove batch text input
  const removeBatchInput = useCallback((index) => {
    setBatchTexts(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Update batch text
  const updateBatchText = useCallback((index, value) => {
    setBatchTexts(prev => prev.map((text, i) => i === index ? value : text));
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setText('');
    setQrCodeUrl('');
    setError('');
    setBatchQRCodes([]);
    setShowBatchResults(false);
  }, []);

  // Handle Enter key
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateQRCode();
    }
  }, [generateQRCode]);

  return (
    <div className="qr-generator-container">
      <div className="qr-generator-header">
        <h1>🔲 QR Code Generator</h1>
        <p>Generate QR codes for text, URLs, and more</p>
      </div>

      <div className="qr-generator-content">
        {/* Input Section */}
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="qr-text">Text or URL</label>
            <textarea
              id="qr-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter text, URL, or any data to generate QR code..."
              rows={4}
              maxLength={2000}
            />
            <div className="char-count">
              {text.length}/2000 characters
            </div>
          </div>

          {/* Settings */}
          <div className="settings-section">
            <div className="settings-tabs">
              <button 
                className={`settings-tab ${!batchMode ? 'active' : ''}`}
                onClick={() => setBatchMode(false)}
              >
                Single QR Code
              </button>
              <button 
                className={`settings-tab ${batchMode ? 'active' : ''}`}
                onClick={() => setBatchMode(true)}
              >
                Batch Generation
              </button>
            </div>

            {!batchMode ? (
              <div className="single-mode-settings">
                <div className="settings-grid">
                  <div className="setting-group">
                    <label htmlFor="qr-size">Size (px)</label>
                    <select
                      id="qr-size"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                    >
                      <option value={150}>150x150</option>
                      <option value={200}>200x200</option>
                      <option value={300}>300x300</option>
                      <option value={400}>400x400</option>
                      <option value={500}>500x500</option>
                      <option value={800}>800x800</option>
                      <option value={1000}>1000x1000</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="error-correction">Error Correction</label>
                    <select
                      id="error-correction"
                      value={errorCorrection}
                      onChange={(e) => setErrorCorrection(e.target.value)}
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="format">Format</label>
                    <select
                      id="format"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                    >
                      <option value="PNG">PNG</option>
                      <option value="SVG">SVG</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="border-size">Border Size</label>
                    <select
                      id="border-size"
                      value={borderSize}
                      onChange={(e) => setBorderSize(parseInt(e.target.value))}
                    >
                      <option value={0}>No Border</option>
                      <option value={2}>Small (2px)</option>
                      <option value={4}>Medium (4px)</option>
                      <option value={6}>Large (6px)</option>
                      <option value={10}>Extra Large (10px)</option>
                    </select>
                  </div>
                </div>

                <div className="color-settings">
                  <div className="color-group">
                    <label htmlFor="bg-color">Background Color</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        id="bg-color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="color-input"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="color-text-input"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div className="color-group">
                    <label htmlFor="fg-color">Foreground Color</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        id="fg-color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="color-input"
                      />
                      <input
                        type="text"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="color-text-input"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="batch-mode-settings">
                <div className="batch-inputs">
                  <label>Batch Texts (one per line)</label>
                  {batchTexts.map((batchText, index) => (
                    <div key={index} className="batch-input-row">
                      <input
                        type="text"
                        value={batchText}
                        onChange={(e) => updateBatchText(index, e.target.value)}
                        placeholder={`Text ${index + 1}`}
                        className="batch-text-input"
                      />
                      {batchTexts.length > 1 && (
                        <button
                          onClick={() => removeBatchInput(index)}
                          className="remove-batch-btn"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addBatchInput} className="add-batch-btn">
                    + Add Another Text
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {!batchMode ? (
              <>
                <button
                  onClick={generateQRCode}
                  disabled={!text.trim() || isLoading}
                  className="generate-btn"
                >
                  {isLoading ? '🔄 Generating...' : '🔲 Generate QR Code'}
                </button>

                <button
                  onClick={clearAll}
                  className="clear-btn"
                  disabled={!text && !qrCodeUrl}
                >
                  🗑️ Clear All
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={generateBatchQRCodes}
                  disabled={batchTexts.filter(t => t.trim()).length === 0 || isLoading}
                  className="generate-btn batch-btn"
                >
                  {isLoading ? '🔄 Generating Batch...' : '📦 Generate Batch QR Codes'}
                </button>

                <button
                  onClick={() => {
                    setBatchTexts(['']);
                    setBatchQRCodes([]);
                    setShowBatchResults(false);
                  }}
                  className="clear-btn"
                >
                  🗑️ Clear Batch
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError('')} className="error-close">✕</button>
          </div>
        )}

        {/* QR Code Display */}
        {qrCodeUrl && !batchMode && (
          <div className="qr-display-section">
            <div className="qr-code-container">
              <img
                src={qrCodeUrl}
                alt="Generated QR Code"
                className="qr-code-image"
                loading="lazy"
              />
              
              <div className="qr-actions">
                <button
                  onClick={downloadQRCode}
                  className="download-btn"
                >
                  📥 Download PNG
                </button>
                
                <button
                  onClick={() => navigator.clipboard.writeText(qrCodeUrl)}
                  className="copy-btn"
                >
                  📋 Copy URL
                </button>
              </div>
            </div>

            <div className="qr-info">
              <h3>QR Code Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Size:</span>
                  <span className="info-value">{size}x{size} px</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Error Correction:</span>
                  <span className="info-value">{errorCorrection}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Data Length:</span>
                  <span className="info-value">{text.length} chars</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Batch QR Codes Display */}
        {showBatchResults && batchQRCodes.length > 0 && (
          <div className="batch-results-section">
            <div className="batch-header">
              <h3>📦 Batch QR Codes Generated</h3>
              <p>Generated {batchQRCodes.length} QR codes. Click individual codes to download or download all at once.</p>
              <button
                onClick={downloadAllBatchQRCodes}
                className="download-all-btn"
              >
                📥 Download All QR Codes
              </button>
            </div>

            <div className="batch-qr-grid">
              {batchQRCodes.map((qrCode) => (
                <div key={qrCode.id} className="batch-qr-item">
                  <div className="batch-qr-container">
                    <img
                      src={qrCode.url}
                      alt={`QR Code ${qrCode.id}`}
                      className="batch-qr-image"
                      loading="lazy"
                    />
                    <div className="batch-qr-overlay">
                      <button
                        onClick={() => downloadBatchQRCode(qrCode)}
                        className="batch-download-btn"
                      >
                        📥 Download
                      </button>
                    </div>
                  </div>
                  <div className="batch-qr-info">
                    <div className="batch-qr-text">
                      {qrCode.text.length > 30 ? qrCode.text.substring(0, 30) + '...' : qrCode.text}
                    </div>
                    <div className="batch-qr-id">QR #{qrCode.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="history-section">
            <h3>📋 Generation History</h3>
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-content">
                    <div className="history-text">{item.text}</div>
                    <div className="history-meta">
                      <span className="history-time">{item.timestamp}</span>
                      <span className="history-details">
                        {item.size}px • {item.errorCorrection} • {item.format}
                      </span>
                    </div>
                  </div>
                  <div className="history-actions">
                    <button
                      onClick={() => window.open(item.url, '_blank')}
                      className="history-btn view-btn"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = item.url;
                        link.download = `qr-${item.id}.${item.format.toLowerCase()}`;
                        link.click();
                      }}
                      className="history-btn download-btn"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Examples */}
        <div className="examples-section">
          <h3>💡 Quick Examples</h3>
          <div className="examples-grid">
            <button
              onClick={() => setText('https://github.com/username/repository')}
              className="example-btn"
            >
              🌐 GitHub Repository
            </button>
            <button
              onClick={() => setText('mailto:contact@example.com?subject=Hello&body=Hi there!')}
              className="example-btn"
            >
              📧 Email with Subject
            </button>
            <button
              onClick={() => setText('tel:+1-555-123-4567')}
              className="example-btn"
            >
              📞 Phone Number
            </button>
            <button
              onClick={() => setText('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;')}
              className="example-btn"
            >
              📶 WiFi Network
            </button>
            <button
              onClick={() => setText('geo:37.7749,-122.4194?q=San Francisco')}
              className="example-btn"
            >
              📍 GPS Location
            </button>
            <button
              onClick={() => setText('BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Company\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD')}
              className="example-btn"
            >
              👤 Contact Card
            </button>
            <button
              onClick={() => setText('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
              className="example-btn"
            >
              🎥 YouTube Video
            </button>
            <button
              onClick={() => setText('Hello, World! This is a QR code test with more content to demonstrate longer text handling.')}
              className="example-btn"
            >
              💬 Long Text Message
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions-section">
          <h4>📋 How to Use</h4>
          <div className="instructions-grid">
            <div className="instruction-card">
              <h5>🔲 Single QR Code</h5>
              <ol>
                <li>Enter your text, URL, or data in the text area</li>
                <li>Customize size, colors, and error correction</li>
                <li>Click "Generate QR Code" to create your QR code</li>
                <li>Download as PNG or SVG format</li>
              </ol>
            </div>
            <div className="instruction-card">
              <h5>📦 Batch Generation</h5>
              <ol>
                <li>Switch to "Batch Generation" mode</li>
                <li>Add multiple texts using the input fields</li>
                <li>Click "Generate Batch QR Codes"</li>
                <li>Download all QR codes as a ZIP file</li>
              </ol>
            </div>
          </div>
          
          <div className="advanced-features-info">
            <h5>⚡ Advanced Features</h5>
            <ul>
              <li><strong>Custom Colors:</strong> Change background and foreground colors</li>
              <li><strong>Multiple Formats:</strong> Export as PNG or SVG</li>
              <li><strong>Error Correction:</strong> Choose from 4 levels of error correction</li>
              <li><strong>Border Control:</strong> Adjust border size or remove completely</li>
              <li><strong>History Tracking:</strong> Keep track of generated QR codes</li>
              <li><strong>Batch Processing:</strong> Generate multiple QR codes at once</li>
              <li><strong>High Resolution:</strong> Up to 1000x1000 pixels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;