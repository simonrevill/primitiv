import init, {
  type Palette,
  generate_greyscale_oklch,
  generate_palette,
} from "harmoni-wasm";
import { useState, useEffect, ChangeEvent } from "react";

type ColorKey =
  | "red"
  | "yellow"
  | "lime"
  | "green"
  | "blue"
  | "indigo"
  | "purple"
  | "pink";

type ColorConfig = {
  hex: string;
  palette?: Palette;
  lightPadding?: number;
  darkPadding?: number;
};

const DEFAULT_COLORS: Record<ColorKey, ColorConfig> = {
  red: { hex: "#EF4444" },
  yellow: { hex: "#F59E0B" },
  lime: { hex: "#9eb22e" },
  green: { hex: "#10B981" },
  blue: { hex: "#3B82F6" },
  indigo: { hex: "#6366F1" },
  purple: { hex: "#8B5CF6" },
  pink: { hex: "#e0218a" },
};

export function useColors() {
  const [wasmReady, setWasmReady] = useState(false);
  const [greyscalePalette, setGreyscalePalette] = useState<Palette>([]);
  const [colors, setColors] =
    useState<Record<ColorKey, ColorConfig>>(DEFAULT_COLORS);

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

  const STANDARD_KEYS: ColorKey[] = [
    "yellow",
    "lime",
    "green",
    "blue",
    "indigo",
    "purple",
    "pink",
  ];

  const MAX_LIGHT_PADDING_PERCENT = 32;
  const MAX_DARK_PADDING_PERCENT = 20;

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

  const handleLightPaddingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const lightPadding = parseFloat(e.target.value) / 100;

    setColors((prev) => ({
      ...prev,
      red: {
        ...prev.red,
        lightPadding,
        palette: generate_palette(
          prev.red.hex,
          lightPadding,
          prev.red.darkPadding ?? 0,
        ),
      },
    }));
  };

  const handleDarkPaddingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const darkPadding = parseFloat(e.target.value) / 100;

    setColors((prev) => ({
      ...prev,
      red: {
        ...prev.red,
        darkPadding,
        palette: generate_palette(
          prev.red.hex,
          prev.red.lightPadding ?? 0,
          darkPadding,
        ),
      },
    }));
  };

  return {
    greyscalePalette,
    handleColorChange,
    colors,
    MAX_LIGHT_PADDING_PERCENT,
    MAX_DARK_PADDING_PERCENT,
    handleLightPaddingChange,
    handleDarkPaddingChange,
    STANDARD_KEYS,
  };
}
