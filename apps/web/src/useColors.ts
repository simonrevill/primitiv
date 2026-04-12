import init, {
  type Palette,
  generate_greyscale_oklch,
  generate_palette,
} from "harmoni-wasm";
import { useState, useEffect, ChangeEvent } from "react";
import type { ColorKey, ColorMap } from "./types";
import { DEFAULT_COLORS, STANDARD_KEYS } from "./constants";

export function useColors() {
  const [wasmReady, setWasmReady] = useState(false);
  const [greyscalePalette, setGreyscalePalette] = useState<Palette>();
  const [colors, setColors] = useState<ColorMap>(DEFAULT_COLORS);

  useEffect(() => {
    init().then(() => setWasmReady(true));
  }, []);

  useEffect(() => {
    if (!wasmReady) return;

    setGreyscalePalette(generate_greyscale_oklch());

    setColors((prev) => {
      const next = { ...prev };

      for (const key of Object.keys(next) as ColorKey[]) {
        const { hex, lightPadding = 0, darkPadding = 0 } = next[key];
        next[key] = {
          ...next[key],
          palette: generate_palette(hex, lightPadding, darkPadding),
        };
      }

      return next;
    });
  }, [wasmReady]);

  const handleColorChange =
    (key: ColorKey) => (e: ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value;

      setColors((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          hex,
          palette: generate_palette(
            hex,
            prev[key].lightPadding ?? 0,
            prev[key].darkPadding ?? 0,
          ),
        },
      }));
    };

  const handleLightPaddingChange =
    (key: ColorKey) => (e: ChangeEvent<HTMLInputElement>) => {
      const lightPadding = parseFloat(e.target.value) / 100;

      setColors((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          lightPadding,
          palette: generate_palette(
            prev[key].hex,
            lightPadding,
            prev[key].darkPadding ?? 0,
          ),
        },
      }));
    };

  const handleDarkPaddingChange =
    (key: ColorKey) => (e: ChangeEvent<HTMLInputElement>) => {
      const darkPadding = parseFloat(e.target.value) / 100;

      setColors((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          darkPadding,
          palette: generate_palette(
            prev[key].hex,
            prev[key].lightPadding ?? 0,
            darkPadding,
          ),
        },
      }));
    };

  return {
    greyscalePalette,
    handleColorChange,
    colors,
    handleLightPaddingChange,
    handleDarkPaddingChange,
    STANDARD_KEYS,
  };
}
