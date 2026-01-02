import React, { useState, useCallback, useMemo } from 'react';
import './UnitConverter.css';

const UnitConverter = () => {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  // Conversion data
  const conversionData = useMemo(() => ({
    length: {
      name: 'Length',
      icon: '📏',
      baseUnit: 'meter',
      units: {
        millimeter: { name: 'Millimeter (mm)', factor: 0.001 },
        centimeter: { name: 'Centimeter (cm)', factor: 0.01 },
        meter: { name: 'Meter (m)', factor: 1 },
        kilometer: { name: 'Kilometer (km)', factor: 1000 },
        inch: { name: 'Inch (in)', factor: 0.0254 },
        foot: { name: 'Foot (ft)', factor: 0.3048 },
        yard: { name: 'Yard (yd)', factor: 0.9144 },
        mile: { name: 'Mile (mi)', factor: 1609.344 },
        nauticalMile: { name: 'Nautical Mile (nmi)', factor: 1852 }
      }
    },
    weight: {
      name: 'Weight',
      icon: '⚖️',
      baseUnit: 'kilogram',
      units: {
        milligram: { name: 'Milligram (mg)', factor: 0.000001 },
        gram: { name: 'Gram (g)', factor: 0.001 },
        kilogram: { name: 'Kilogram (kg)', factor: 1 },
        ton: { name: 'Metric Ton (t)', factor: 1000 },
        ounce: { name: 'Ounce (oz)', factor: 0.0283495 },
        pound: { name: 'Pound (lb)', factor: 0.453592 },
        stone: { name: 'Stone (st)', factor: 6.35029 }
      }
    },
    temperature: {
      name: 'Temperature',
      icon: '🌡️',
      baseUnit: 'celsius',
      units: {
        celsius: { name: 'Celsius (°C)', factor: 1 },
        fahrenheit: { name: 'Fahrenheit (°F)', factor: 1 },
        kelvin: { name: 'Kelvin (K)', factor: 1 },
        rankine: { name: 'Rankine (°R)', factor: 1 }
      }
    },
    area: {
      name: 'Area',
      icon: '📐',
      baseUnit: 'squareMeter',
      units: {
        squareMillimeter: { name: 'Square Millimeter (mm²)', factor: 0.000001 },
        squareCentimeter: { name: 'Square Centimeter (cm²)', factor: 0.0001 },
        squareMeter: { name: 'Square Meter (m²)', factor: 1 },
        squareKilometer: { name: 'Square Kilometer (km²)', factor: 1000000 },
        squareInch: { name: 'Square Inch (in²)', factor: 0.00064516 },
        squareFoot: { name: 'Square Foot (ft²)', factor: 0.092903 },
        squareYard: { name: 'Square Yard (yd²)', factor: 0.836127 },
        acre: { name: 'Acre (ac)', factor: 4046.86 },
        hectare: { name: 'Hectare (ha)', factor: 10000 }
      }
    },
    volume: {
      name: 'Volume',
      icon: '🥤',
      baseUnit: 'liter',
      units: {
        milliliter: { name: 'Milliliter (ml)', factor: 0.001 },
        liter: { name: 'Liter (l)', factor: 1 },
        cubicMeter: { name: 'Cubic Meter (m³)', factor: 1000 },
        fluidOunce: { name: 'Fluid Ounce (fl oz)', factor: 0.0295735 },
        cup: { name: 'Cup (cup)', factor: 0.236588 },
        pint: { name: 'Pint (pt)', factor: 0.473176 },
        quart: { name: 'Quart (qt)', factor: 0.946353 },
        gallon: { name: 'Gallon (gal)', factor: 3.78541 }
      }
    },
    speed: {
      name: 'Speed',
      icon: '🏃',
      baseUnit: 'meterPerSecond',
      units: {
        meterPerSecond: { name: 'Meter/Second (m/s)', factor: 1 },
        kilometerPerHour: { name: 'Kilometer/Hour (km/h)', factor: 0.277778 },
        milePerHour: { name: 'Mile/Hour (mph)', factor: 0.44704 },
        footPerSecond: { name: 'Foot/Second (ft/s)', factor: 0.3048 },
        knot: { name: 'Knot (kn)', factor: 0.514444 }
      }
    },
    electrical: {
      name: 'Electrical',
      icon: '⚡',
      baseUnit: 'watt',
      units: {
        // Power Units
        watt: { name: 'Watt (W)', factor: 1 },
        kilowatt: { name: 'Kilowatt (kW)', factor: 1000 },
        megawatt: { name: 'Megawatt (MW)', factor: 1000000 },
        horsepower: { name: 'Horsepower (HP)', factor: 745.7 },
        // Voltage Units (normalized to volts)
        millivolt: { name: 'Millivolt (mV)', factor: 0.001, type: 'voltage' },
        volt: { name: 'Volt (V)', factor: 1, type: 'voltage' },
        kilovolt: { name: 'Kilovolt (kV)', factor: 1000, type: 'voltage' },
        // Current Units (normalized to amperes)
        milliampere: { name: 'Milliampere (mA)', factor: 0.001, type: 'current' },
        ampere: { name: 'Ampere (A)', factor: 1, type: 'current' },
        kiloampere: { name: 'Kiloampere (kA)', factor: 1000, type: 'current' }
      }
    },
    energy: {
      name: 'Energy',
      icon: '🔋',
      baseUnit: 'joule',
      units: {
        joule: { name: 'Joule (J)', factor: 1 },
        kilojoule: { name: 'Kilojoule (kJ)', factor: 1000 },
        calorie: { name: 'Calorie (cal)', factor: 4.184 },
        kilocalorie: { name: 'Kilocalorie (kcal)', factor: 4184 },
        wattHour: { name: 'Watt Hour (Wh)', factor: 3600 },
        kilowattHour: { name: 'Kilowatt Hour (kWh)', factor: 3600000 },
        btu: { name: 'British Thermal Unit (BTU)', factor: 1055.06 }
      }
    },
    pressure: {
      name: 'Pressure',
      icon: '🌪️',
      baseUnit: 'pascal',
      units: {
        pascal: { name: 'Pascal (Pa)', factor: 1 },
        kilopascal: { name: 'Kilopascal (kPa)', factor: 1000 },
        bar: { name: 'Bar', factor: 100000 },
        atmosphere: { name: 'Atmosphere (atm)', factor: 101325 },
        psi: { name: 'Pounds per Square Inch (psi)', factor: 6894.76 },
        torr: { name: 'Torr', factor: 133.322 },
        mmHg: { name: 'Millimeter of Mercury (mmHg)', factor: 133.322 }
      }
    }
  }), []);

  // Initialize units when category changes
  React.useEffect(() => {
    const units = Object.keys(conversionData[selectedCategory].units);
    setFromUnit(units[0] || '');
    setToUnit(units[1] || units[0] || '');
    setInputValue('');
    setResult('');
  }, [selectedCategory, conversionData]);

  // Temperature conversion functions
  const convertTemperature = useCallback((value, from, to) => {
    let celsius;
    
    // Convert to Celsius first
    switch (from) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      case 'rankine':
        celsius = (value - 491.67) * 5/9;
        break;
      default:
        celsius = value;
    }
    
    // Convert from Celsius to target
    switch (to) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return celsius * 9/5 + 32;
      case 'kelvin':
        return celsius + 273.15;
      case 'rankine':
        return celsius * 9/5 + 491.67;
      default:
        return celsius;
    }
  }, []);

  // Main conversion function with electrical unit handling
  const convertValue = useCallback((value, from, to, category) => {
    if (!value || isNaN(value) || from === to) {
      return value;
    }

    if (category === 'temperature') {
      return convertTemperature(parseFloat(value), from, to);
    }

    // Special handling for electrical units
    if (category === 'electrical') {
      const fromUnit = conversionData[category].units[from];
      const toUnit = conversionData[category].units[to];
      
      // Check if converting between different electrical types
      if (fromUnit.type && toUnit.type && fromUnit.type !== toUnit.type) {
        // Cannot convert between different electrical types (voltage, current, power)
        return 'Cannot convert between different electrical types';
      }
      
      // If both are power units or both are voltage/current units, proceed normally
      if ((!fromUnit.type && !toUnit.type) || (fromUnit.type === toUnit.type)) {
        const fromFactor = fromUnit.factor;
        const toFactor = toUnit.factor;
        const baseValue = parseFloat(value) * fromFactor;
        return baseValue / toFactor;
      }
    }

    // For other units, convert through base unit
    const categoryData = conversionData[category];
    const fromFactor = categoryData.units[from].factor;
    const toFactor = categoryData.units[to].factor;
    
    const baseValue = parseFloat(value) * fromFactor;
    return baseValue / toFactor;
  }, [conversionData, convertTemperature]);

  // Handle input change and convert with error handling
  const handleInputChange = useCallback((value) => {
    setInputValue(value);
    
    if (value && !isNaN(value) && fromUnit && toUnit) {
      const convertedValue = convertValue(value, fromUnit, toUnit, selectedCategory);
      
      if (typeof convertedValue === 'string') {
        // Handle error messages (like electrical type mismatch)
        setResult(convertedValue);
      } else {
        setResult(convertedValue.toFixed(8).replace(/\.?0+$/, ''));
      }
    } else {
      setResult('');
    }
  }, [fromUnit, toUnit, selectedCategory, convertValue]);

  // Swap units
  const swapUnits = useCallback(() => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    
    if (result) {
      setInputValue(result);
      setResult(inputValue);
    }
  }, [fromUnit, toUnit, inputValue, result]);

  // Add to history
  const addToHistory = useCallback(() => {
    if (inputValue && result && fromUnit && toUnit) {
      const historyItem = {
        id: Date.now(),
        category: selectedCategory,
        from: { value: inputValue, unit: fromUnit },
        to: { value: result, unit: toUnit },
        timestamp: new Date().toLocaleTimeString()
      };
      
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
    }
  }, [inputValue, result, fromUnit, toUnit, selectedCategory]);

  // Clear all
  const clearAll = useCallback(() => {
    setInputValue('');
    setResult('');
    setHistory([]);
  }, []);

  // Format number for display
  const formatNumber = useCallback((num) => {
    if (!num) return '';
    const number = parseFloat(num);
    if (number === 0) return '0';
    if (Math.abs(number) >= 1000000) {
      return number.toExponential(6);
    }
    return number.toFixed(8).replace(/\.?0+$/, '');
  }, []);

  return (
    <div className="unit-converter-container">
      <div className="unit-converter-header">
        <h1>🔄 Unit Converter</h1>
        <p>Convert between different units of measurement</p>
      </div>

      <div className="unit-converter-content">
        {/* Category Selection */}
        <div className="category-section">
          <h3>Select Category</h3>
          <div className="category-grid">
            {Object.entries(conversionData).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversion Section */}
        <div className="conversion-section">
          <div className="conversion-header">
            <h3>{conversionData[selectedCategory].icon} {conversionData[selectedCategory].name} Converter</h3>
          </div>

          <div className="conversion-grid">
            {/* From Unit */}
            <div className="unit-input-group">
              <label>From</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="unit-select"
              >
                {Object.entries(conversionData[selectedCategory].units).map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter value"
                className="value-input"
                step="any"
              />
            </div>

            {/* Swap Button */}
            <div className="swap-section">
              <button onClick={swapUnits} className="swap-btn" title="Swap units">
                🔄
              </button>
            </div>

            {/* To Unit */}
            <div className="unit-input-group">
              <label>To</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="unit-select"
              >
                {Object.entries(conversionData[selectedCategory].units).map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <div className="result-display">
                {result ? formatNumber(result) : '0'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={addToHistory}
              disabled={!inputValue || !result}
              className="add-history-btn"
            >
              📝 Add to History
            </button>
            <button onClick={clearAll} className="clear-btn">
              🗑️ Clear All
            </button>
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="history-section">
            <h3>📋 Conversion History</h3>
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-conversion">
                    <span className="history-category">
                      {conversionData[item.category].icon} {conversionData[item.category].name}
                    </span>
                    <div className="history-values">
                      <span className="from-value">
                        {formatNumber(item.from.value)} {conversionData[item.category].units[item.from.unit].name}
                      </span>
                      <span className="arrow">→</span>
                      <span className="to-value">
                        {formatNumber(item.to.value)} {conversionData[item.category].units[item.to.unit].name}
                      </span>
                    </div>
                  </div>
                  <div className="history-time">{item.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Conversions */}
        <div className="quick-conversions-section">
          <h3>⚡ Quick Conversions</h3>
          <div className="quick-grid">
            <button onClick={() => { setInputValue('1'); handleInputChange('1'); }} className="quick-btn">
              1 {conversionData[selectedCategory].units[fromUnit]?.name.split(' ')[0]}
            </button>
            <button onClick={() => { setInputValue('10'); handleInputChange('10'); }} className="quick-btn">
              10 {conversionData[selectedCategory].units[fromUnit]?.name.split(' ')[0]}
            </button>
            <button onClick={() => { setInputValue('100'); handleInputChange('100'); }} className="quick-btn">
              100 {conversionData[selectedCategory].units[fromUnit]?.name.split(' ')[0]}
            </button>
            <button onClick={() => { setInputValue('1000'); handleInputChange('1000'); }} className="quick-btn">
              1000 {conversionData[selectedCategory].units[fromUnit]?.name.split(' ')[0]}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions-section">
          <h4>📋 How to Use</h4>
          <ol>
            <li>Select a measurement category (Length, Weight, Temperature, etc.)</li>
            <li>Choose the units you want to convert from and to</li>
            <li>Enter the value you want to convert</li>
            <li>The result will be calculated automatically</li>
            <li>Use the swap button (🔄) to reverse the conversion</li>
            <li>Add conversions to history for reference</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;