import { useCallback, useMemo, useState } from "react";

import type { MillerColumnsContextValue } from "../types";

export function useMillerColumnsRoot() {
  const [strip, setStrip] = useState<HTMLElement | null>(null);

  const setStripElement = useCallback((element: HTMLDivElement | null) => {
    setStrip(element);
  }, []);

  const contextValue = useMemo<MillerColumnsContextValue>(
    () => ({ strip, setStrip: setStripElement }),
    [strip, setStripElement],
  );

  return { contextValue };
}
