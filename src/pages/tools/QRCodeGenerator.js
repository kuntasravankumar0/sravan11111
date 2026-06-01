import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, QrCode } from 'lucide-react';
import '../Tools.css';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (text.trim()) {
      // Using Google Charts API for QR generation
      const encoded = encodeURIComponent(text);
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`);
    } else {
      setQrUrl('');
    }
  }, [text]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qrcode.png';
    link.click();
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
          <div className="tool-icon-wrap"><QrCode size={32} /></div>
          <h1>QR Code Generator</h1>
          <p>Generate QR codes instantly for any text or URL.</p>
        </motion.div>

        <motion.div
          className="tool-card glass-strong"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="tool-input-section">
            <textarea
              placeholder="Enter text or URL to generate QR code..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="tool-textarea"
            />
          </div>

          {qrUrl && (
            <motion.div
              className="qr-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img src={qrUrl} alt="QR Code" className="qr-image" ref={canvasRef} />
              <button className="btn-primary" onClick={handleDownload}>
                <Download size={18} /> Download QR
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
