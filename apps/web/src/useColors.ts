import init, {
  type Palette,
  type TintMode,
  Swatch,
  generate_neutral_ramp,
  generate_palette_with_lightness,
} from "harmoni-wasm";
import { useState, useEffect, ChangeEvent } from "react";
import type { ColorKey, ColorMap } from "./types";
import { DEFAULT_COLORS, STANDARD_KEYS, DEFAULT_LIGHTNESS } from "./constants";

export function useColors() {
  const [wasmReady, setWasmReady] = useState(false);
  const [greyscalePalette, setGreyscalePalette] = useState<Palette>();
  const [neutralWhite, setNeutralWhite] = useState("#ffffff");
  const [neutralBlack, setNeutralBlack] = useState("#000000");
  const [colors, setColors] = useState<ColorMap>(DEFAULT_COLORS);

  useEffect(() => {
    init().then(() => setWasmReady(true));
  }, []);

  useEffect(() => {
    if (!wasmReady) return;

    setColors((prev) => {
      const next = { ...prev };

      for (const key of Object.keys(next) as ColorKey[]) {
        const { hex, lightPadding = 0, darkPadding = 0 } = next[key];
        const lightnessArray = next[key].lightnessArray ?? DEFAULT_LIGHTNESS;
        next[key] = {
          ...next[key],
          lightnessArray,
          palette: generate_palette_with_lightness(
            hex,
            lightnessArray,
            lightPadding,
            darkPadding,
          ),
        };
      }

      return next;
    });
  }, [wasmReady]);

  // The neutral ramp regenerates whenever the white or black primitive
  // changes, keeping the two pickers and the ramp in sync.
  useEffect(() => {
    if (!wasmReady) return;

    setGreyscalePalette(
      generate_neutral_ramp(neutralWhite, neutralBlack, "Inherit" as TintMode),
    );
  }, [wasmReady, neutralWhite, neutralBlack]);

  const handleNeutralWhiteChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNeutralWhite(e.target.value);
  };

  const handleNeutralBlackChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNeutralBlack(e.target.value);
  };

  const handleColorChange =
    (key: ColorKey) => (e: ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value;

      setColors((prev) => {
        const lightnessArray = prev[key].lightnessArray ?? DEFAULT_LIGHTNESS;
        return {
          ...prev,
          [key]: {
            ...prev[key],
            hex,
            lightnessArray,
            palette: generate_palette_with_lightness(
              hex,
              lightnessArray,
              prev[key].lightPadding ?? 0,
              prev[key].darkPadding ?? 0,
            ),
          },
        };
      });
    };

  const handleLightPaddingChange =
    (key: ColorKey) => (e: ChangeEvent<HTMLInputElement>) => {
      const lightPadding = parseFloat(e.target.value) / 100;

      setColors((prev) => {
        const lightnessArray = prev[key].lightnessArray ?? DEFAULT_LIGHTNESS;
        return {
          ...prev,
          [key]: {
            ...prev[key],
            lightPadding,
            lightnessArray,
            palette: generate_palette_with_lightness(
              prev[key].hex,
              lightnessArray,
              lightPadding,
              prev[key].darkPadding ?? 0,
            ),
          },
        };
      });
    };

  const handleDarkPaddingChange =
    (key: ColorKey) => (e: ChangeEvent<HTMLInputElement>) => {
      const darkPadding = parseFloat(e.target.value) / 100;

      setColors((prev) => {
        const lightnessArray = prev[key].lightnessArray ?? DEFAULT_LIGHTNESS;
        return {
          ...prev,
          [key]: {
            ...prev[key],
            darkPadding,
            lightnessArray,
            palette: generate_palette_with_lightness(
              prev[key].hex,
              lightnessArray,
              prev[key].lightPadding ?? 0,
              darkPadding,
            ),
          },
        };
      });
    };

  const handleLightnessCurveChange =
    (key: ColorKey, index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);

      setColors((prev) => {
        const prevLightness = prev[key].lightnessArray ?? DEFAULT_LIGHTNESS;
        const lightnessArray = prevLightness.map((v, i) =>
          i === index ? value : v,
        );
        return {
          ...prev,
          [key]: {
            ...prev[key],
            lightnessArray,
            palette: generate_palette_with_lightness(
              prev[key].hex,
              lightnessArray,
              prev[key].lightPadding ?? 0,
              prev[key].darkPadding ?? 0,
            ),
          },
        };
      });
    };

  const handleShiftLeft = (key: ColorKey, targetSwatch?: Swatch) => {
    const hex = `oklch(${targetSwatch?.l} ${targetSwatch?.c} ${targetSwatch?.h})`;

    setColors((prev) => {
      const lightnessArray = prev[key].lightnessArray ?? DEFAULT_LIGHTNESS;
      return {
        ...prev,
        [key]: {
          ...prev[key],
          hex,
          lightnessArray,
          palette: generate_palette_with_lightness(
            hex,
            lightnessArray,
            prev[key].lightPadding ?? 0,
            prev[key].darkPadding ?? 0,
          ),
        },
      };
    });
  };

  const handleShiftRight = (key: ColorKey, targetSwatch?: Swatch) => {
    const hex = `oklch(${targetSwatch?.l} ${targetSwatch?.c} ${targetSwatch?.h})`;

    setColors((prev) => {
      const lightnessArray = prev[key].lightnessArray ?? DEFAULT_LIGHTNESS;
      return {
        ...prev,
        [key]: {
          ...prev[key],
          hex,
          lightnessArray,
          palette: generate_palette_with_lightness(
            hex,
            lightnessArray,
            prev[key].lightPadding ?? 0,
            prev[key].darkPadding ?? 0,
          ),
        },
      };
    });
  };

  return {
    greyscalePalette,
    neutralWhite,
    neutralBlack,
    handleNeutralWhiteChange,
    handleNeutralBlackChange,
    handleColorChange,
    colors,
    handleLightPaddingChange,
    handleDarkPaddingChange,
    handleLightnessCurveChange,
    STANDARD_KEYS,
    handleShiftLeft,
    handleShiftRight,
  };
}
