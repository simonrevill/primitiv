import { useState, useEffect, Fragment, ChangeEvent } from "react";
import init, {
  get_contrast_rating,
  ContrastResult,
  generate_greyscale_oklch,
  generate_palette,
  Palette,
} from "primitiv-wasm";
import "./App.scss";

// 1. Single Source of Truth
const COLORS = [
  { id: "black", name: "Black", bg: "oklch(0 0 0)", fg: "oklch(1 0 0)" },
  { id: "white", name: "White", bg: "oklch(1 0 0)", fg: "oklch(0 0 0)" },
  {
    id: "pink",
    name: "Pink",
    bg: "oklch(0.8677 0.0735 7.09)",
    fg: "oklch(1 0 0)",
  }, // SHOULD FAIL
] as const;

function App() {
  const [isReady, setIsReady] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [contrast, setContrast] = useState<ContrastResult | null>(null);
  const [greyscalePalette, setGreyscalePalette] = useState<Palette[]>();
  const [color, setColor] = useState("#3B82F6");
  const [customPalette, setCustomPalette] = useState<Palette[]>();

  // 2. Derive current color from index
  const activeColor = COLORS[selectedIndex];

  useEffect(() => {
    init().then(() => {
      // Initial calculation
      const result = get_contrast_rating(COLORS[0].bg, COLORS[0].fg);
      setContrast(result);
      setGreyscalePalette(generate_greyscale_oklch());

      console.log(color);
      setCustomPalette(generate_palette(color));
      setIsReady(true);
    });
  }, []);

  useEffect(() => {}, [color, setCustomPalette]);

  const handleColorChange = (index: number) => {
    setSelectedIndex(index);
    if (isReady) {
      const { bg, fg } = COLORS[index];
      const result = get_contrast_rating(bg, fg);
      setContrast(result);
    }
  };

  const handleCustomColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setColor(e.target.value);
    setCustomPalette(generate_palette(color));
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
        <div
          role="status"
          className="status-ratio"
          aria-labelledby="status-ratio"
        >
          <span id="status-ratio">
            Ratio: {contrast?.display_ratio ?? "Loading..."}
          </span>
        </div>
        <div
          role="status"
          className="status-rating"
          aria-labelledby="status-rating"
        >
          <span id="status-rating">Rating: {contrast?.rating}</span>
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
      <div className="swatch-container">
        {greyscalePalette?.map((step, index) => (
          <div
            key={
              ("Number" in step.label
                ? `number-${step.label.Number}`
                : `name-${step.label.Name}`) + `-${index}`
            }
            className="swatch"
            style={{
              background: `oklch(${step.l} ${step.c} ${step.h})`,
              color: `oklch(${step.best_foreground.l} ${step.best_foreground.c} ${step.best_foreground.h})`,
            }}
          >
            <p>
              {"Number" in step.best_foreground.label
                ? step.best_foreground.label.Number
                : step.best_foreground.label.Name}
            </p>
            <p>{step.contrast_result.display_ratio}</p>
            <p>{step.contrast_result.rating}</p>
          </div>
        ))}
      </div>
      <p style={{ color: "ocklch(1.0 0 0)" }}>{color}</p>
      <input type="color" onChange={handleCustomColorChange} value={color} />
      <div className="swatch-container">
        {customPalette?.map((step, index) => (
          <div
            key={
              ("Number" in step.label
                ? `number-${step.label.Number}`
                : `name-${step.label.Name}`) + `-${index}`
            }
            className="swatch"
            style={{
              background: `oklch(${step.l} ${step.c} ${step.h})`,
              color: `oklch(${step.best_foreground.l} ${step.best_foreground.c} ${step.best_foreground.h})`,
            }}
          >
            <p>
              {"Number" in step.best_foreground.label
                ? step.best_foreground.label.Number
                : step.best_foreground.label.Name}
            </p>
            <p>{step.contrast_result.display_ratio}</p>
            <p>{step.contrast_result.rating}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
