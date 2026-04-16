import { Tabs } from "@primitiv/components";
import { Palette as ColorPalette } from "./Palette";
import { useColors } from "./useColors";
import "./App.scss";

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
        <p className="palette__label">Greyscale</p>
        <div className="palette-container">
          <div className="palette">
            <ColorPalette palette={greyscalePalette} />
          </div>
        </div>

        {STANDARD_KEYS.map((key) => {
          const { hex, palette, lightPadding, darkPadding } = colors[key];

          return (
            <>
              <p className="palette__label">Red</p>
              <input
                type="color"
                onChange={handleColorChange(key)}
                value={hex}
              />
              <div key={key} className="palette-container">
                <div key={key} className="palette">
                  <ColorPalette palette={palette} />
                  <div className="palette__curve-editor">
                    <Tabs.Root defaultValue="a">
                      <Tabs.List label="Demo tabs">
                        <Tabs.Trigger value="a">Sliders</Tabs.Trigger>
                        <Tabs.Trigger value="b">Curve</Tabs.Trigger>
                      </Tabs.List>
                      <Tabs.Content value="a">
                        {palette?.lightness_curve.map(
                          (lightnessValue, index) => (
                            <input
                              key={index}
                              className="palette__slider palette__slider--curve"
                              type="range"
                              role="slider"
                              min={0}
                              max={1}
                              step={0.01}
                              value={lightnessValue}
                              onChange={handleLightnessCurveChange(key, index)}
                            />
                          ),
                        )}
                      </Tabs.Content>
                      <Tabs.Content value="b">Second panel</Tabs.Content>
                    </Tabs.Root>
                  </div>
                </div>
                <div className="palette-padding">
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
            </>
          );
        })}
      </div>
    </main>
  );
}

export default App;
