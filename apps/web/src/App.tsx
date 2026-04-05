import { useState, useEffect, ChangeEvent } from "react";
import init, {
  generate_greyscale_oklch,
  generate_palette,
  Palette,
} from "primitiv-wasm";
import "./App.scss";

function App() {
  const [greyscalePalette, setGreyscalePalette] = useState<Palette[]>();
  const [color, setColor] = useState("#3B82F6");
  const [customPalette, setCustomPalette] = useState<Palette[]>();

  useEffect(() => {
    init().then(() => {
      setGreyscalePalette(generate_greyscale_oklch());
      setCustomPalette(generate_palette(color));
    });
  }, [color]);

  useEffect(() => {}, [color, setCustomPalette]);

  const handleCustomColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setColor(e.target.value);
    setCustomPalette(generate_palette(color));
  };

  return (
    <main className="container">
      <h1>Primitiv Engine</h1>
      <p style={{ color: "ocklch(1.0 0 0)" }}>Greyscale</p>
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
