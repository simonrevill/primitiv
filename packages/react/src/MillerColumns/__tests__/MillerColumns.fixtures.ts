/**
 * Shared, pure test data for the MillerColumns suite. No helpers, no JSX.
 */

/** Arrow / Home / End navigation within a single column (items A, B, C). */
export const verticalArrowCases = [
  { key: "{ArrowDown}", from: "A", to: "B" },
  { key: "{ArrowDown}", from: "B", to: "C" },
  { key: "{ArrowUp}", from: "C", to: "B" },
  { key: "{ArrowUp}", from: "B", to: "A" },
  { key: "{ArrowDown}", from: "C", to: "A" },
  { key: "{ArrowUp}", from: "A", to: "C" },
  { key: "{Home}", from: "B", to: "A" },
  { key: "{End}", from: "B", to: "C" },
] as const;
