import { useCallback, useRef, useState } from "react";

import type { TooltipProviderContextValue } from "../types";

type UseTooltipProviderArgs = {
  delayDuration: number;
  skipDelayDuration: number;
};

export function useTooltipProvider({
  delayDuration,
  skipDelayDuration,
}: UseTooltipProviderArgs) {
  const [isOpenGlobally, setIsOpenGlobally] = useState(false);
  const skipDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onOpenGlobally = useCallback(() => {
    if (skipDelayTimerRef.current !== null) {
      clearTimeout(skipDelayTimerRef.current);
      skipDelayTimerRef.current = null;
    }
    setIsOpenGlobally(true);
  }, []);

  const onCloseGlobally = useCallback(() => {
    skipDelayTimerRef.current = setTimeout(() => {
      setIsOpenGlobally(false);
      skipDelayTimerRef.current = null;
    }, skipDelayDuration);
  }, [skipDelayDuration]);

  const contextValue: TooltipProviderContextValue = {
    delayDuration,
    skipDelayDuration,
    isOpenGlobally,
    onOpenGlobally,
    onCloseGlobally,
  };

  return { contextValue };
}
