import { useCallback } from "react";

import { useControllableState } from "../../hooks";

import type { TreeContextValue } from "../types";

export type UseTreeRootOptions = {
  expandedValues: string[] | undefined;
  defaultExpandedValues: string[] | undefined;
  onExpandedChange: ((values: string[]) => void) | undefined;
  selectionMode: "single";
  selectedValue: string | null | undefined;
  defaultSelectedValue: string | null | undefined;
  onSelectedValueChange: ((value: string | null) => void) | undefined;
};

/**
 * Owns the Tree's expansion and selection state, exposing the
 * read/toggle/select surface shared with every sub-component via
 * `TreeContext`.
 */
export function useTreeRoot(options: UseTreeRootOptions): TreeContextValue {
  const [expandedValues, setExpandedValues] = useControllableState<string[]>(
    options.expandedValues,
    options.defaultExpandedValues ?? [],
    options.onExpandedChange,
  );

  const [selectedValue, setSelectedValue] = useControllableState<string | null>(
    options.selectedValue,
    options.defaultSelectedValue ?? null,
    options.onSelectedValueChange,
  );

  const isExpanded = useCallback(
    (value: string) => expandedValues.includes(value),
    [expandedValues],
  );

  const toggleExpanded = useCallback(
    (value: string, next?: boolean) => {
      const open = expandedValues.includes(value);
      const shouldOpen = next ?? !open;
      if (shouldOpen === open) {
        return;
      }
      setExpandedValues(
        shouldOpen
          ? [...expandedValues, value]
          : expandedValues.filter((current) => current !== value),
      );
    },
    [expandedValues, setExpandedValues],
  );

  const isSelected = useCallback(
    (value: string) => selectedValue === value,
    [selectedValue],
  );

  const select = useCallback(
    (value: string) => {
      if (selectedValue === value) {
        return;
      }
      setSelectedValue(value);
    },
    [selectedValue, setSelectedValue],
  );

  return {
    selectionMode: options.selectionMode,
    isExpanded,
    toggleExpanded,
    isSelected,
    select,
  };
}
