import { Tabs } from "@primitiv/components";

import { Palette as ColorPalette } from "./Palette";
import { useColors } from "./useColors";
import { Fragment } from "react/jsx-runtime";

export function ColorEngine() {
  const {
    greyscalePalette,
    handleColorChange,
    colors,
    handleLightPaddingChange,
    handleDarkPaddingChange,
    handleLightnessCurveChange,
    STANDARD_KEYS,
    handleShiftLeft,
    handleShiftRight,
  } = useColors();

  return (
    <>
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
            <Fragment key={key}>
              <p className="palette__label">Red</p>
              <input
                type="color"
                onChange={handleColorChange(key)}
                value={hex}
              />
              <div className="palette-container">
                <div className="palette">
                  <ColorPalette palette={palette} />
                  <div className="palette__curve-editor">
                    <Tabs.Root
                      className="palette__curve-editor-tabs"
                      defaultValue="a"
                    >
                      <Tabs.List label="Demo tabs">
                        <Tabs.Trigger value="a">Sliders</Tabs.Trigger>
                        <Tabs.Trigger value="b">Curve</Tabs.Trigger>
                      </Tabs.List>
                      <Tabs.Content className="palette__sliders" value="a">
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
                      <Tabs.Content className="palette__curve" value="b">
                        Second panel
                      </Tabs.Content>
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
                  <button
                    type="button"
                    onClick={() => handleShiftLeft(key, palette?.swatches[6])}
                  >
                    {"< Shift"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShiftRight(key, palette?.swatches[4])}
                  >
                    {"Shift >"}
                  </button>
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
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
