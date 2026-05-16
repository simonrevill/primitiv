import { useContext, useMemo } from "react";

import { MillerColumnsColumnContext } from "../MillerColumnsContext";

import type { MillerColumnsColumnContextValue } from "../types";

import { useMillerColumnsContext } from "./useMillerColumnsContext";

export function useMillerColumnsColumn() {
  const { slots, columnWidths } = useMillerColumnsContext();
  const parentColumn = useContext(MillerColumnsColumnContext);
  const depth = parentColumn ? parentColumn.depth + 1 : 0;

  const slot = slots.get(depth) ?? null;
  const width = columnWidths.get(depth);

  const columnContextValue = useMemo<MillerColumnsColumnContextValue>(
    () => ({ depth }),
    [depth],
  );

  return { slot, depth, width, columnContextValue };
}
