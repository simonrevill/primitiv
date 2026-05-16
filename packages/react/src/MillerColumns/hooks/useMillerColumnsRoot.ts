import { useCallback, useMemo, useState } from "react";

import { useControllableState } from "../../hooks";

import type { MillerColumnsContextValue } from "../types";
import { selectAtDepth } from "../utils";

export function useMillerColumnsRoot(
  controlledValue: string[] | undefined,
  defaultValue: string[] | undefined,
  onValueChange: ((path: string[]) => void) | undefined,
) {
  const [strip, setStrip] = useState<HTMLElement | null>(null);

  const setStripElement = useCallback((element: HTMLDivElement | null) => {
    setStrip(element);
  }, []);

  const [activePath, setActivePath] = useControllableState<string[]>(
    controlledValue,
    defaultValue ?? [],
    onValueChange,
  );

  const select = useCallback(
    (depth: number, value: string) => {
      setActivePath(selectAtDepth(activePath, depth, value));
    },
    [activePath, setActivePath],
  );

  const contextValue = useMemo<MillerColumnsContextValue>(
    () => ({ strip, setStrip: setStripElement, activePath, select }),
    [strip, setStripElement, activePath, select],
  );

  return { contextValue };
}
