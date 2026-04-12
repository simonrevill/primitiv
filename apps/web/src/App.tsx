import { useState, useEffect, ChangeEvent } from "react";
import init, {
  generate_greyscale_oklch,
  generate_palette,
  type Palette,
} from "harmoni-wasm";
import "./App.scss";
import { Palette as ColorPalette } from "./Palette";

function App() {
  const [greyscalePalette, setGreyscalePalette] = useState<Palette>();
  const [redColor, setRedColor] = useState("#EF4444");
  const [redPalette, setRedPalette] = useState<Palette>();
  const [yellowColor, setYellowColor] = useState("#F59E0B");
  const [yellowPalette, setYellowPalette] = useState<Palette>();
  const [limeColor, setLimeColor] = useState("#9eb22e");
  const [limePalette, setLimePalette] = useState<Palette>();
  const [greenColor, setGreenColor] = useState("#10B981");
  const [greenPalette, setGreenPalette] = useState<Palette>();
  const [blueColor, setBlueColor] = useState("#3B82F6");
  const [bluePalette, setBluePalette] = useState<Palette>();
  const [indigoColor, setIndigoColor] = useState("#6366F1");
  const [indigoPalette, setIndigoPalette] = useState<Palette>();
  const [purpleColor, setPurpleColor] = useState("#8B5CF6");
  const [purplePalette, setPurplePalette] = useState<Palette>();
  const [pinkColor, setPinkColor] = useState("#e0218a");
  const [pinkPalette, setPinkPalette] = useState<Palette>();

  // const TARGET_LIGHTNESS = [
  //   0.97, 0.91, 0.83, 0.76, 0.67, 0.55, 0.45, 0.32, 0.22, 0.15,
  // ];
  // const safeNegative = Math.min(...TARGET_LIGHTNESS) - 0.01; // ~0.14

  // Better padding limits
  const MAX_LIGHT_PADDING_PERCENT = 32; // up to +0.30 on light end (quite bright)
  const MAX_DARK_PADDING_PERCENT = 20; // much more conservative on dark end

  const [redLightPaddingPercent, setRedLightPaddingPercent] =
    useState<number>(0);
  const [redDarkPaddingPercent, setRedDarkPaddingPercent] = useState<number>(0);

  useEffect(() => {
    init().then(() => {
      setGreyscalePalette(generate_greyscale_oklch());
      const result = generate_palette(
        redColor,
        redLightPaddingPercent / 100, // ← positive = brighter
        redDarkPaddingPercent / 100, // ← positive = darker
      );
      console.log("RESULT: ", result);
      setRedPalette(result);
      setYellowPalette(generate_palette(yellowColor, 0, 0));
      setLimePalette(generate_palette(limeColor, 0, 0));
      setGreenPalette(generate_palette(greenColor, 0, 0));
      setBluePalette(generate_palette(blueColor, 0, 0));
      setIndigoPalette(generate_palette(indigoColor, 0, 0));
      setPurplePalette(generate_palette(purpleColor, 0, 0));
      setPinkPalette(generate_palette(pinkColor, 0, 0));
    });
  }, [
    blueColor,
    yellowColor,
    limeColor,
    pinkColor,
    redColor,
    greenColor,
    indigoColor,
    purpleColor,
    redLightPaddingPercent,
    redDarkPaddingPercent,
  ]);

  const handleYellowColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setYellowColor(e.target.value);
    setYellowPalette(generate_palette(blueColor, 0, 0));
  };

  const handleLimeColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLimeColor(e.target.value);
    setLimePalette(generate_palette(limeColor, 0, 0));
  };

  const handleGreenColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGreenColor(e.target.value);
    setGreenPalette(generate_palette(greenColor, 0, 0));
  };

  const handleBlueColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBlueColor(e.target.value);
    setBluePalette(generate_palette(blueColor, 0, 0));
  };

  const handleIndigoColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIndigoColor(e.target.value);
    setIndigoPalette(generate_palette(indigoColor, 0, 0));
  };

  const handlePurpleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPurpleColor(e.target.value);
    setPurplePalette(generate_palette(purpleColor, 0, 0));
  };

  const handlePinkColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPinkColor(e.target.value);
    setPinkPalette(generate_palette(pinkColor, 0, 0));
  };

  // Color change handler
  const handleRedColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setRedColor(v);
    setRedPalette(
      generate_palette(
        v,
        redLightPaddingPercent / 100,
        redDarkPaddingPercent / 100,
      ),
    );
  };

  // Handler for light padding
  const handleRedLightPaddingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const p = parseFloat(e.target.value);
    setRedLightPaddingPercent(p);

    setRedPalette(
      generate_palette(
        redColor,
        p / 100, // positive = brighter light end
        redDarkPaddingPercent / 100,
      ),
    );
  };

  // Handler for dark padding
  const handleRedDarkPaddingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const p = parseFloat(e.target.value);
    setRedDarkPaddingPercent(p);

    setRedPalette(
      generate_palette(
        redColor,
        redLightPaddingPercent / 100,
        p / 100, // positive = darker dark end
      ),
    );
  };

  return (
    <main className="container">
      <h1>Primitiv Engine</h1>
      <div className="palettes-grid">
        <div className="palette-container palette-container--no-picker">
          <p className="palette-label">Greyscale</p>
          <ColorPalette palette={greyscalePalette} />
        </div>

        <div className="palette-container">
          <p className="palette-label">Red</p>
          <input
            type="color"
            onChange={handleRedColorChange}
            value={redColor}
          />
          <ColorPalette palette={redPalette} />
          <div className="slider-row">
            <input
              type="range"
              min={0}
              max={MAX_LIGHT_PADDING_PERCENT}
              step={1}
              value={redLightPaddingPercent}
              onChange={handleRedLightPaddingChange}
            />
            <span className="slider-label">{redLightPaddingPercent}%</span>
            <input
              type="range"
              min={0}
              max={MAX_DARK_PADDING_PERCENT}
              step={1}
              value={redDarkPaddingPercent}
              onChange={handleRedDarkPaddingChange}
            />
            <span className="slider-label">{redDarkPaddingPercent}%</span>
          </div>
        </div>

        <div className="palette-container">
          <p className="palette-label">Yellow</p>
          <input
            type="color"
            onChange={handleYellowColorChange}
            value={yellowColor}
          />
          <ColorPalette palette={yellowPalette} />
        </div>

        <div className="palette-container">
          <p className="palette-label">Lime</p>
          <input
            type="color"
            onChange={handleLimeColorChange}
            value={limeColor}
          />
          <ColorPalette palette={limePalette} />
        </div>

        <div className="palette-container">
          <p className="palette-label">Green</p>
          <input
            type="color"
            onChange={handleGreenColorChange}
            value={greenColor}
          />
          <ColorPalette palette={greenPalette} />
        </div>

        <div className="palette-container">
          <p className="palette-label">Blue</p>
          <input
            type="color"
            onChange={handleBlueColorChange}
            value={blueColor}
          />
          <ColorPalette palette={bluePalette} />
        </div>

        <div className="palette-container">
          <p className="palette-label">Indigo</p>
          <input
            type="color"
            onChange={handleIndigoColorChange}
            value={indigoColor}
          />
          <ColorPalette palette={indigoPalette} />
        </div>

        <div className="palette-container">
          <p className="palette-label">Purple</p>
          <input
            type="color"
            onChange={handlePurpleColorChange}
            value={purpleColor}
          />
          <ColorPalette palette={purplePalette} />
        </div>

        <div className="palette-container">
          <p className="palette-label">Pink</p>
          <input
            type="color"
            onChange={handlePinkColorChange}
            value={pinkColor}
          />
          <ColorPalette palette={pinkPalette} />
        </div>
      </div>
    </main>
  );
}

export default App;
