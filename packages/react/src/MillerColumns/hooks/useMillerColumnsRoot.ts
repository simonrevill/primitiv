import { useCallback, useMemo, useState } from "react";

import type { MillerColumnsContextValue } from "../types";
import { selectAtDepth } from "../utils";

export function useMillerColumnsRoot(defaultValue: string[] | undefined) {
  const [strip, setStrip] = useState<HTMLElement | null>(null);
  const [activePath, setActivePath] = useState<string[]>(defaultValue ?? []);

  const setStripElement = useCallback((element: HTMLDivElement | null) => {
    setStrip(element);
  }, []);

  const select = useCallback((depth: number, value: string) => {
    setActivePath((prev) => selectAtDepth(prev, depth, value));
  }, []);

  const contextValue = useMemo<MillerColumnsContextValue>(
    () => ({ strip, setStrip: setStripElement, activePath, select }),
    [strip, setStripElement, activePath, select],
  );

  return { contextValue };
}
