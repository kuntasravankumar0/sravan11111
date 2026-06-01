import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Ruler } from 'lucide-react';
import '../Tools.css';

const categories = {
  Length: {
    units: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Mile', 'Yard', 'Foot', 'Inch'],
    toBase: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 },
  },
  Weight: {
    units: ['Kilogram', 'Gram', 'Milligram', 'Pound', 'Ounce', 'Ton'],
    toBase: { Kilogram: 1, Gram: 0.001, Milligram: 0.000001, Pound: 0.453592, Ounce: 0.0283495, Ton: 1000 },
  },
  Temperature: {
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    toBase: null, // Special handling
  },
};

function convertTemp(value, from, to) {
  let celsius;
  if (from === 'Celsius') celsius = value;
  else if (from === 'Fahrenheit') celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;

  if (to === 'Celsius') return celsius;
  if (to === 'Fahrenheit') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export default function UnitConverter() {
  const [category, setCategory] = useState('Length');
  const [fromUnit, setFromUnit] = useState('Meter');
  const [toUnit, setToUnit] = useState('Kilometer');
  const [value, setValue] = useState('1');

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';

    if (category === 'Temperature') {
      return convertTemp(num, fromUnit, toUnit).toFixed(4);
    }

    const cat = categories[category];
    const baseValue = num * cat.toBase[fromUnit];
    return (baseValue / cat.toBase[toUnit]).toFixed(6).replace(/\.?0+$/, '');
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setFromUnit(categories[cat].units[0]);
    setToUnit(categories[cat].units[1]);
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
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
          <div className="tool-icon-wrap"><Ruler size={32} /></div>
          <h1>Unit Converter</h1>
          <p>Convert between different units of measurement.</p>
        </motion.div>

        <motion.div
          className="tool-card glass-strong"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ maxWidth: '560px', margin: '0 auto' }}
        >
          <div className="category-tabs">
            {Object.keys(categories).map((cat) => (
              <button
                key={cat}
                className={`filter-tab ${category === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="converter-grid">
            <div className="converter-col">
              <label>From</label>
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="converter-select">
                {categories[category].units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="converter-input"
              />
            </div>

            <button className="swap-btn" onClick={swap}>
              <ArrowLeftRight size={20} />
            </button>

            <div className="converter-col">
              <label>To</label>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="converter-select">
                {categories[category].units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <div className="converter-result">{convert()}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
