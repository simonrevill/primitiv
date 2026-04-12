import "./App.scss";
import { Palette as ColorPalette } from "./Palette";
import { useColors } from "./useColors";

function App() {
  const {
    greyscalePalette,
    handleColorChange,
    colors,
    MAX_LIGHT_PADDING_PERCENT,
    MAX_DARK_PADDING_PERCENT,
    handleLightPaddingChange,
    handleDarkPaddingChange,
    STANDARD_KEYS,
  } = useColors();

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
            onChange={handleColorChange("red")}
            value={colors.red.hex}
          />
          <ColorPalette palette={colors.red.palette} />
          <div className="slider-row">
            <input
              type="range"
              min={0}
              max={MAX_LIGHT_PADDING_PERCENT}
              step={1}
              value={(colors.red.lightPadding ?? 0) * 100}
              onChange={handleLightPaddingChange}
            />
            <span className="slider-label">
              {((colors.red.lightPadding ?? 0) * 100).toFixed(0)}%
            </span>
            <input
              type="range"
              min={0}
              max={MAX_DARK_PADDING_PERCENT}
              step={1}
              value={(colors.red.darkPadding ?? 0) * 100}
              onChange={handleDarkPaddingChange}
            />
            <span className="slider-label">
              {((colors.red.darkPadding ?? 0) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        {STANDARD_KEYS.map((key) => (
          <div key={key} className="palette-container">
            <p className="palette-label">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </p>
            <input
              type="color"
              onChange={handleColorChange(key)}
              value={colors[key].hex}
            />
            <ColorPalette palette={colors[key].palette} />
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
