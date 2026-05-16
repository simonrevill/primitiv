import { useContext, useMemo } from "react";

import { MillerColumnsColumnContext } from "../MillerColumnsContext";

import type { MillerColumnsColumnContextValue } from "../types";

import { useMillerColumnsContext } from "./useMillerColumnsContext";

export function useMillerColumnsColumn() {
  const { strip } = useMillerColumnsContext();
  const parentColumn = useContext(MillerColumnsColumnContext);
  const depth = parentColumn ? parentColumn.depth + 1 : 0;

  const columnContextValue = useMemo<MillerColumnsColumnContextValue>(
    () => ({ depth }),
    [depth],
  );

  return { strip, depth, columnContextValue };
}
