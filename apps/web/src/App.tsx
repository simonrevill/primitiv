import "./App.scss";
import { Palette as ColorPalette } from "./Palette";
import { useColors } from "./useColors";

function App() {
  const {
    greyscalePalette,
    handleColorChange,
    colors,
    handleLightPaddingChange,
    handleDarkPaddingChange,
    STANDARD_KEYS,
  } = useColors();

  return (
    <main className="container">
      <h1>Primitiv Engine</h1>
      <div className="palettes-grid">
        <div className="palette palette--no-picker">
          <p className="palette__label">Greyscale</p>
          <ColorPalette palette={greyscalePalette} />
        </div>

        {STANDARD_KEYS.map((key) => (
          <div key={key} className="palette">
            <p className="palette__label">Red</p>
            <input
              type="color"
              onChange={handleColorChange("red")}
              value={colors[key].hex}
            />
            <ColorPalette palette={colors[key].palette} />
            <div className="slider-row">
              <input
                type="range"
                role="slider"
                min={0}
                max={
                  (colors[key].palette?.max_recommended_light_padding ?? 0) *
                  100
                }
                step={1}
                value={(colors[key].lightPadding ?? 0) * 100}
                onChange={handleLightPaddingChange(key)}
              />
              <span className="slider-label">
                {((colors[key].lightPadding ?? 0) * 100).toFixed(0)}%
              </span>
              <input
                type="range"
                role="slider"
                min={0}
                max={
                  (colors[key].palette?.max_recommended_dark_padding ?? 0) * 100
                }
                step={1}
                value={(colors[key].darkPadding ?? 0) * 100}
                onChange={handleDarkPaddingChange(key)}
              />
              <span className="slider-label">
                {((colors[key].darkPadding ?? 0) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
