import React, { useState, useCallback, useEffect } from 'react';
import './ColorPicker.css';

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState('#3498db');
  const [colorHistory, setColorHistory] = useState([]);
  const [colorPalettes, setColorPalettes] = useState([]);
  const [copyMessage, setCopyMessage] = useState('');

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Generate color palette
  const generatePalette = useCallback((baseColor) => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return [];

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const palette = [];

    // Generate complementary colors
    for (let i = 0; i < 5; i++) {
      const newHue = (hsl.h + (i * 72)) % 360;
      const newColor = hslToHex(newHue, hsl.s, hsl.l);
      palette.push(newColor);
    }

    return palette;
  }, []);

  // Convert HSL to Hex
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Copy to clipboard
  const copyToClipboard = useCallback((text, format) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyMessage(`${format} copied!`);
      setTimeout(() => setCopyMessage(''), 2000);
    });
  }, []);

  // Add color to history
  const addToHistory = useCallback((color) => {
    setColorHistory(prev => {
      const newHistory = [color, ...prev.filter(c => c !== color)];
      return newHistory.slice(0, 10);
    });
  }, []);

  // Handle color change
  const handleColorChange = useCallback((color) => {
    setSelectedColor(color);
    addToHistory(color);
    setColorPalettes(generatePalette(color));
  }, [addToHistory, generatePalette]);

  // Generate random color
  const generateRandomColor = useCallback(() => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    handleColorChange(randomColor);
  }, [handleColorChange]);

  // Predefined color palettes
  const predefinedPalettes = [
    ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    ['#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#E17055'],
    ['#2D3436', '#636E72', '#B2BEC3', '#DDD', '#FFF'],
    ['#E74C3C', '#E67E22', '#F39C12', '#F1C40F', '#2ECC71'],
    ['#9B59B6', '#8E44AD', '#3498DB', '#2980B9', '#1ABC9C']
  ];

  useEffect(() => {
    setColorPalettes(generatePalette(selectedColor));
  }, [selectedColor, generatePalette]);

  const rgb = hexToRgb(selectedColor);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : { h: 0, s: 0, l: 0 };

  return (
    <div className="color-picker-container">
      <div className="color-picker-header">
        <h1>🎨 Color Picker & Palette Generator</h1>
        <p>Pick colors, generate palettes, and get color codes</p>
      </div>

      {copyMessage && (
        <div className="copy-message">
          ✅ {copyMessage}
        </div>
      )}

      <div className="color-picker-main">
        <div className="color-picker-section">
          <div className="color-display" style={{ backgroundColor: selectedColor }}>
            <div className="color-overlay">
              <h2>{selectedColor.toUpperCase()}</h2>
            </div>
          </div>

          <div className="color-input-section">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="color-input"
            />
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="hex-input"
              placeholder="#000000"
            />
            <button className="random-btn" onClick={generateRandomColor}>
              🎲 Random
            </button>
          </div>

          <div className="color-formats">
            <div className="format-item">
              <label>HEX:</label>
              <div className="format-value">
                <span>{selectedColor.toUpperCase()}</span>
                <button onClick={() => copyToClipboard(selectedColor.toUpperCase(), 'HEX')}>
                  📋
                </button>
              </div>
            </div>
            <div className="format-item">
              <label>RGB:</label>
              <div className="format-value">
                <span>rgb({rgb?.r}, {rgb?.g}, {rgb?.b})</span>
                <button onClick={() => copyToClipboard(`rgb(${rgb?.r}, ${rgb?.g}, ${rgb?.b})`, 'RGB')}>
                  📋
                </button>
              </div>
            </div>
            <div className="format-item">
              <label>HSL:</label>
              <div className="format-value">
                <span>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span>
                <button onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}>
                  📋
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="palettes-section">
          <h3>🌈 Generated Palette</h3>
          <div className="palette-colors">
            {colorPalettes.map((color, index) => (
              <div
                key={index}
                className="palette-color"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                title={color}
              >
                <span className="color-code">{color}</span>
              </div>
            ))}
          </div>

          <h3>🎯 Predefined Palettes</h3>
          <div className="predefined-palettes">
            {predefinedPalettes.map((palette, paletteIndex) => (
              <div key={paletteIndex} className="predefined-palette">
                {palette.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="predefined-color"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
            ))}
          </div>

          {colorHistory.length > 0 && (
            <>
              <h3>📜 Recent Colors</h3>
              <div className="color-history">
                {colorHistory.map((color, index) => (
                  <div
                    key={index}
                    className="history-color"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="color-picker-features">
        <h3>✨ Features</h3>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">🎨</span>
            <span>Color Picker</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🌈</span>
            <span>Palette Generator</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📋</span>
            <span>Copy Color Codes</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎲</span>
            <span>Random Colors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;