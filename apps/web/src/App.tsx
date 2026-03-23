import { useState, useEffect, Fragment } from 'react';
import init, { get_contrast_rating, ContrastData } from 'primitiv-wasm';
import './App.scss';

// 1. Single Source of Truth
const COLORS = [
  { id: 'black', name: 'Black', bg: '#000000', fg: '#FFFFFF' },
  { id: 'white', name: 'White', bg: '#FFFFFF', fg: '#000000' },
  { id: 'pink', name: 'Pink', bg: '#FFC0CB', fg: '#FFFFFF' }, // SHOULD FAIL
] as const;

function App() {
  const [isReady, setIsReady] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [contrast, setContrast] = useState<ContrastData | null>(null);

  // 2. Derive current color from index
  const activeColor = COLORS[selectedIndex];

  useEffect(() => {
    init().then(() => {
      setIsReady(true);
      // Initial calculation
      const result = get_contrast_rating(COLORS[0].bg, COLORS[0].fg);
      setContrast(result);
    });
  }, []);

  const handleColorChange = (index: number) => {
    setSelectedIndex(index);
    if (isReady) {
      const { bg, fg } = COLORS[index];
      const result = get_contrast_rating(bg, fg);
      setContrast(result);
    }
  };

  return (
    <main className="container">
      <h1>Primitiv Engine</h1>

      <section
        className="preview-box"
        aria-label="Color Preview"
        style={{ backgroundColor: activeColor.bg, color: activeColor.fg }}
      >
        <p className="preview-text">Sample Text</p>
        <div role="status" className="status-ratio" aria-labelledby="status-ratio">
          <span id="status-ratio">
            Ratio: {contrast?.display_ratio ?? "Loading..."}
          </span>
        </div>
        <div role="status" className="status-rating" aria-labelledby="status-rating">
          <span id="status-rating">
            Rating: {contrast?.rating}
          </span>
        </div>
      </section>

      <div className="controls">
        {COLORS.map((color, index) => (
          <Fragment key={color.id}>
            <input
              id={color.id}
              name="color-choice"
              type="radio"
              checked={selectedIndex === index}
              onChange={() => handleColorChange(index)}
              className="radio-input"
            />
            <label htmlFor={color.id}>{color.name}</label>
          </Fragment>
        ))}
      </div>
    </main>
  );
}

export default App;