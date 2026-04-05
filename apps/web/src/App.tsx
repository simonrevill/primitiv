import { useState, useEffect, ChangeEvent } from "react";
import init, {
  generate_greyscale_oklch,
  generate_palette,
  Palette,
} from "primitiv-wasm";
import "./App.scss";

function App() {
  const [greyscalePalette, setGreyscalePalette] = useState<Palette[]>();
  const [blueColor, setBlueColor] = useState("#3B82F6");
  const [bluePalette, setBluePalette] = useState<Palette[]>();
  const [yellowColor, setYellowColor] = useState("#b89f2e");
  const [yellowPalette, setYellowPalette] = useState<Palette[]>();
  const [limeColor, setLimeColor] = useState("#9eb22e");
  const [limePalette, setLimePalette] = useState<Palette[]>();

  useEffect(() => {
    init().then(() => {
      setGreyscalePalette(generate_greyscale_oklch());
      setBluePalette(generate_palette(blueColor));
      setYellowPalette(generate_palette(yellowColor));
      setLimePalette(generate_palette(limeColor));
    });
  }, [blueColor, yellowColor, limeColor]);

  useEffect(() => {}, [blueColor, setBluePalette]);

  const handleBlueColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBlueColor(e.target.value);
    setBluePalette(generate_palette(blueColor));
  };

  const handleYellowColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setYellowColor(e.target.value);
    setYellowPalette(generate_palette(blueColor));
  };

  const handleLimeColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLimeColor(e.target.value);
    setLimePalette(generate_palette(limeColor));
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
          >
            <div
              className="swatch-inner"
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
            <p className="swatch-step">{index === 0 ? 50 : index * 100}</p>
          </div>
        ))}
      </div>
      <p style={{ color: "ocklch(0.55 0.200 90)" }}>Blue</p>
      <input type="color" onChange={handleBlueColorChange} value={blueColor} />
      <div className="swatch-container">
        {bluePalette?.map((step, index) => (
          <div
            key={
              ("Number" in step.label
                ? `number-${step.label.Number}`
                : `name-${step.label.Name}`) + `-${index}`
            }
            className="swatch"
          >
            <div
              key={
                ("Number" in step.label
                  ? `number-${step.label.Number}`
                  : `name-${step.label.Name}`) + `-${index}`
              }
              className="swatch-inner"
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
            <p className="swatch-step">{index === 0 ? 50 : index * 100}</p>
          </div>
        ))}
      </div>
      <p style={{ color: "ocklch(1.0 0 0)" }}>Yellow</p>
      <input
        type="color"
        onChange={handleYellowColorChange}
        value={yellowColor}
      />
      <div className="swatch-container">
        {yellowPalette?.map((step, index) => (
          <div
            key={
              ("Number" in step.label
                ? `number-${step.label.Number}`
                : `name-${step.label.Name}`) + `-${index}`
            }
            className="swatch"
          >
            <div
              key={
                ("Number" in step.label
                  ? `number-${step.label.Number}`
                  : `name-${step.label.Name}`) + `-${index}`
              }
              className="swatch-inner"
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
            <p className="swatch-step">{index === 0 ? 50 : index * 100}</p>
          </div>
        ))}
      </div>
      <p style={{ color: "ocklch(0.55 0.178 130)" }}>Lime</p>
      <input type="color" onChange={handleLimeColorChange} value={limeColor} />
      <div className="swatch-container">
        {limePalette?.map((step, index) => (
          <div
            key={
              ("Number" in step.label
                ? `number-${step.label.Number}`
                : `name-${step.label.Name}`) + `-${index}`
            }
            className="swatch"
          >
            <div
              key={
                ("Number" in step.label
                  ? `number-${step.label.Number}`
                  : `name-${step.label.Name}`) + `-${index}`
              }
              className="swatch-inner"
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
            <p className="swatch-step">{index === 0 ? 50 : index * 100}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
