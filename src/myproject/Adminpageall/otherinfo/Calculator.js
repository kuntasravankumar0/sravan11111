import React, { useState, useCallback } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);

  const inputNumber = useCallback((num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const performOperation = useCallback((nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      
      // Add to history
      setHistory(prev => [...prev, `${currentValue} ${operation} ${inputValue} = ${newValue}`].slice(-10));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation]);

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const percentage = useCallback(() => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  }, [display]);

  const toggleSign = useCallback(() => {
    if (display !== '0') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display);
    }
  }, [display]);

  const sqrt = useCallback(() => {
    const value = Math.sqrt(parseFloat(display));
    setDisplay(String(value));
    setHistory(prev => [...prev, `√${display} = ${value}`].slice(-10));
  }, [display]);

  const square = useCallback(() => {
    const value = Math.pow(parseFloat(display), 2);
    setDisplay(String(value));
    setHistory(prev => [...prev, `${display}² = ${value}`].slice(-10));
  }, [display]);

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>🧮 Advanced Calculator</h1>
        <p>Perform calculations with scientific functions</p>
      </div>

      <div className="calculator-main">
        <div className="calculator-wrapper">
          <div className="calculator-display">
            <div className="display-value">{display}</div>
            {operation && previousValue !== null && (
              <div className="display-operation">
                {previousValue} {operation}
              </div>
            )}
          </div>

          <div className="calculator-buttons">
            {/* First Row */}
            <button className="btn btn-function" onClick={clear}>AC</button>
            <button className="btn btn-function" onClick={toggleSign}>±</button>
            <button className="btn btn-function" onClick={percentage}>%</button>
            <button className="btn btn-operator" onClick={() => performOperation('÷')}>÷</button>

            {/* Second Row */}
            <button className="btn btn-number" onClick={() => inputNumber(7)}>7</button>
            <button className="btn btn-number" onClick={() => inputNumber(8)}>8</button>
            <button className="btn btn-number" onClick={() => inputNumber(9)}>9</button>
            <button className="btn btn-operator" onClick={() => performOperation('×')}>×</button>

            {/* Third Row */}
            <button className="btn btn-number" onClick={() => inputNumber(4)}>4</button>
            <button className="btn btn-number" onClick={() => inputNumber(5)}>5</button>
            <button className="btn btn-number" onClick={() => inputNumber(6)}>6</button>
            <button className="btn btn-operator" onClick={() => performOperation('-')}>−</button>

            {/* Fourth Row */}
            <button className="btn btn-number" onClick={() => inputNumber(1)}>1</button>
            <button className="btn btn-number" onClick={() => inputNumber(2)}>2</button>
            <button className="btn btn-number" onClick={() => inputNumber(3)}>3</button>
            <button className="btn btn-operator" onClick={() => performOperation('+')}>+</button>

            {/* Fifth Row */}
            <button className="btn btn-number btn-zero" onClick={() => inputNumber(0)}>0</button>
            <button className="btn btn-number" onClick={inputDecimal}>.</button>
            <button className="btn btn-equals" onClick={() => performOperation('=')}>=</button>

            {/* Scientific Functions */}
            <button className="btn btn-scientific" onClick={sqrt}>√</button>
            <button className="btn btn-scientific" onClick={square}>x²</button>
          </div>
        </div>

        {/* History Panel */}
        <div className="calculator-history">
          <div className="history-header">
            <h3>📜 History</h3>
            {history.length > 0 && (
              <button className="btn-clear-history" onClick={clearHistory}>
                Clear
              </button>
            )}
          </div>
          <div className="history-list">
            {history.length === 0 ? (
              <p className="no-history">No calculations yet</p>
            ) : (
              history.map((item, index) => (
                <div key={index} className="history-item">
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="calculator-features">
        <h3>✨ Features</h3>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">🔢</span>
            <span>Basic Operations</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🧪</span>
            <span>Scientific Functions</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>Calculation History</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⌨️</span>
            <span>Keyboard Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;