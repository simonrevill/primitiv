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
    handleLightnessCurveChange,
    STANDARD_KEYS,
  } = useColors();

  return (
    <main className="container">
      <h1>Harmoni Color Engine</h1>
      <div className="palettes-grid">
        <div className="palette palette--no-picker">
          <p className="palette__label">Greyscale</p>
          <ColorPalette palette={greyscalePalette} />
        </div>

        {STANDARD_KEYS.map((key) => {
          const { hex, palette, lightPadding, darkPadding } = colors[key];

          return (
            <div key={key} className="palette">
              <p className="palette__label">Red</p>
              <input
                type="color"
                onChange={handleColorChange(key)}
                value={hex}
              />
              <ColorPalette palette={palette} />
              <div className="palette__editor">
                <div className="palette__slider-container palette__slider-container--light-padding">
                  <input
                    type="range"
                    role="slider"
                    min={0}
                    max={(palette?.max_recommended_light_padding ?? 0) * 100}
                    step={1}
                    value={(lightPadding ?? 0) * 100}
                    onChange={handleLightPaddingChange(key)}
                  />
                  <span className="slider-label">
                    {((lightPadding ?? 0) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="palette__slider-container palette__slider-container--curve-editor">
                  {palette?.lightness_curve.map((node, index) => (
                    <input
                      key={index}
                      className="palette__slider palette__slider--curve"
                      type="range"
                      role="slider"
                      min={0}
                      max={1}
                      step={0.01}
                      value={node}
                      onChange={handleLightnessCurveChange(key, index)}
                    />
                  ))}
                </div>
                <div className="palette__slider-container palette__slider-container--dark-padding">
                  <input
                    type="range"
                    role="slider"
                    min={0}
                    max={(palette?.max_recommended_dark_padding ?? 0) * 100}
                    step={1}
                    value={(darkPadding ?? 0) * 100}
                    onChange={handleDarkPaddingChange(key)}
                  />
                  <span className="slider-label">
                    {((darkPadding ?? 0) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default App;
