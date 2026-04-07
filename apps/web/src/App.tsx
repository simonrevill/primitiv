import { useState, useEffect, ChangeEvent } from "react";
import init, {
  generate_greyscale_oklch,
  generate_palette,
  type Palette,
} from "primitiv-wasm";
import "./App.scss";
import { Palette as ColorPalette } from "./Palette";

function App() {
  const [greyscalePalette, setGreyscalePalette] = useState<Palette[]>();
  const [redColor, setRedColor] = useState("#EF4444");
  const [redPalette, setRedPalette] = useState<Palette[]>();
  const [yellowColor, setYellowColor] = useState("#F59E0B");
  const [yellowPalette, setYellowPalette] = useState<Palette[]>();
  const [limeColor, setLimeColor] = useState("#9eb22e");
  const [limePalette, setLimePalette] = useState<Palette[]>();
  const [greenColor, setGreenColor] = useState("#10B981");
  const [greenPalette, setGreenPalette] = useState<Palette[]>();
  const [blueColor, setBlueColor] = useState("#3B82F6");
  const [bluePalette, setBluePalette] = useState<Palette[]>();
  const [indigoColor, setIndigoColor] = useState("#6366F1");
  const [indigoPalette, setIndigoPalette] = useState<Palette[]>();
  const [purpleColor, setPurpleColor] = useState("#8B5CF6");
  const [purplePalette, setPurplePalette] = useState<Palette[]>();
  const [pinkColor, setPinkColor] = useState("#e0218a");
  const [pinkPalette, setPinkPalette] = useState<Palette[]>();

  useEffect(() => {
    init().then(() => {
      setGreyscalePalette(generate_greyscale_oklch());
      setRedPalette(generate_palette(redColor));
      setYellowPalette(generate_palette(yellowColor));
      setLimePalette(generate_palette(limeColor));
      setGreenPalette(generate_palette(greenColor));
      setBluePalette(generate_palette(blueColor));
      setIndigoPalette(generate_palette(indigoColor));
      setPurplePalette(generate_palette(purpleColor));
      setPinkPalette(generate_palette(pinkColor));
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
  ]);

  useEffect(() => {}, [blueColor, setBluePalette]);

  const handleRedColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRedColor(e.target.value);
    setRedPalette(generate_palette(redColor));
  };

  const handleYellowColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setYellowColor(e.target.value);
    setYellowPalette(generate_palette(blueColor));
  };

  const handleLimeColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLimeColor(e.target.value);
    setLimePalette(generate_palette(limeColor));
  };

  const handleGreenColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGreenColor(e.target.value);
    setGreenPalette(generate_palette(greenColor));
  };

  const handleBlueColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBlueColor(e.target.value);
    setBluePalette(generate_palette(blueColor));
  };

  const handleIndigoColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIndigoColor(e.target.value);
    setIndigoPalette(generate_palette(indigoColor));
  };

  const handlePurpleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPurpleColor(e.target.value);
    setPurplePalette(generate_palette(purpleColor));
  };

  const handlePinkColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPinkColor(e.target.value);
    setPinkPalette(generate_palette(pinkColor));
  };

  return (
    <main className="container">
      <h1>Primitiv Engine</h1>
      <p className="palette-label">Greyscale</p>
      <ColorPalette palette={greyscalePalette} />

      <div className="palette-container">
        <p className="palette-label">Red</p>
        <input type="color" onChange={handleRedColorChange} value={redColor} />
        <ColorPalette palette={redPalette} />
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
    </main>
  );
}

export default App;
