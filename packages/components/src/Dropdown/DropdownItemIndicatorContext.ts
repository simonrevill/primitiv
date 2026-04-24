import { createContext } from "react";

/**
 * Provided by {@link DropdownCheckboxItem} and {@link DropdownRadioItem}.
 * {@link DropdownItemIndicator} reads it to decide whether to render and
 * what `data-state` to expose.
 */
export type DropdownItemIndicatorContextValue = {
  checked: boolean | "indeterminate";
};

export const DropdownItemIndicatorContext =
  createContext<DropdownItemIndicatorContextValue | null>(null);
