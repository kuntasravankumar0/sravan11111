import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon } from 'lucide-react';
import '../Tools.css';

const buttons = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
];

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [hasResult, setHasResult] = useState(false);

  const handleClick = (val) => {
    if (val === 'C') {
      setDisplay('0');
      setEquation('');
      setHasResult(false);
      return;
    }

    if (val === '⌫') {
      setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
      return;
    }

    if (val === '±') {
      setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
      return;
    }

    if (val === '=') {
      try {
        const expr = equation + display;
        const sanitized = expr
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/%/g, '/100');
        // eslint-disable-next-line no-eval
        const result = eval(sanitized);
        setDisplay(String(parseFloat(result.toFixed(10))));
        setEquation('');
        setHasResult(true);
      } catch {
        setDisplay('Error');
      }
      return;
    }

    if (['+', '-', '×', '÷', '%'].includes(val)) {
      setEquation(equation + display + val);
      setDisplay('0');
      setHasResult(false);
      return;
    }

    // Number or dot
    if (hasResult) {
      setDisplay(val);
      setHasResult(false);
    } else {
      setDisplay(display === '0' && val !== '.' ? val : display + val);
    }
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
          <div className="tool-icon-wrap"><CalcIcon size={32} /></div>
          <h1>Calculator</h1>
          <p>A clean, premium calculator for quick math.</p>
        </motion.div>

        <motion.div
          className="calc-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="calc-card glass-strong">
            <div className="calc-display">
              <div className="calc-equation">{equation}</div>
              <div className="calc-value">{display}</div>
            </div>
            <div className="calc-buttons">
              {buttons.flat().map((btn, i) => (
                <button
                  key={i}
                  className={`calc-btn ${
                    ['+', '-', '×', '÷', '='].includes(btn) ? 'operator' :
                    btn === 'C' ? 'clear' : ''
                  } ${btn === '0' ? 'zero' : ''}`}
                  onClick={() => handleClick(btn)}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
