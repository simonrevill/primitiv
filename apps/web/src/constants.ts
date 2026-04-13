import type { ColorMap, ColorKey } from "./types";

export const DEFAULT_LIGHTNESS: number[] = [0.97, 0.91, 0.83, 0.76, 0.67, 0.55, 0.45, 0.32, 0.22, 0.15];

export const DEFAULT_COLORS: ColorMap = {
  red: { hex: "#EF4444" },
  yellow: { hex: "#F59E0B" },
  lime: { hex: "#9eb22e" },
  green: { hex: "#10B981" },
  blue: { hex: "#3B82F6" },
  indigo: { hex: "#6366F1" },
  purple: { hex: "#8B5CF6" },
  pink: { hex: "#e0218a" },
};

export const STANDARD_KEYS: ColorKey[] = [
  "red",
  "yellow",
  "lime",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
];
