import { useState, useEffect, ChangeEvent, Fragment } from 'react';
import init, { get_contrast_rating, ContrastData } from 'primitiv-wasm';
import './App.scss';

const BG_COLORS = {
  0: '#000000',
  1: '#FFFFFF',
} as const

const FG_COLORS = {
  0: '#FFFFFF',
  1: '#000000',
} as const

const COLOR_NAMES = {
  0: 'Black',
  1: 'White',
} as const

function App() {
  const [contrast, setContrast] = useState<ContrastData | null>(null);
  const [step, setStep] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);

  const bgColor = BG_COLORS[step as keyof typeof BG_COLORS];
  const fgColor = FG_COLORS[step as keyof typeof FG_COLORS];

  useEffect(() => {
    init().then(() => {
      setIsReady(true);
      setContrast(get_contrast_rating(bgColor, "#FFFFFF"));
    });
  }, []);

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStep = parseInt(e.target.value) as keyof typeof BG_COLORS;
    setStep(newStep);

    if (isReady) {
      const newBackgroundColor = BG_COLORS[newStep];
      const newForegroundColor = FG_COLORS[newStep];
      const result = get_contrast_rating(newBackgroundColor, newForegroundColor);
      console.log('result: ', result);
      setContrast(result);
    }
  };

  return (
    <main className="container">
      <h1>Primitiv Engine</h1>

      <section
        className="preview-box"
        aria-label="Color Preview"
        style={{ backgroundColor: bgColor, color: fgColor }}
      >
        <p className="preview-text">Sample Text</p>
        <div role="status" aria-label="status-ratio" className="status-rating">
          Ratio: {contrast?.display_ratio}
        </div>
        <div role="status" aria-label="status-rating" className="status-rating">
          Rating: {contrast?.rating}
        </div>
      </section>
      {Object.keys(BG_COLORS).map((i) => parseInt(i)).map((colorIndex) => (
        <Fragment key={colorIndex}>
          <input
            key={colorIndex}
            id={BG_COLORS[colorIndex as keyof typeof BG_COLORS]}
            name="color"
            value={colorIndex}
            className="slider"
            type="radio"
            onChange={handleColorChange}
          />
          <label htmlFor={BG_COLORS[colorIndex as keyof typeof BG_COLORS]}>{COLOR_NAMES[colorIndex as keyof typeof COLOR_NAMES]}</label>
        </Fragment>
      ))}
    </main>
  );
}

export default App;