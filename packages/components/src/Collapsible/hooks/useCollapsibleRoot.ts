import { useCallback, useId, useMemo } from "react";

import { useControllableState } from "../../hooks";

export function useCollapsibleRoot(
  controlledOpen: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange: ((open: boolean) => void) | undefined,
) {
  const collapsibleId = useId();
  const [open, setOpen] = useControllableState<boolean>(
    controlledOpen,
    defaultOpen,
    onOpenChange,
  );

  const toggle = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const contextValue = useMemo(
    () => ({
      open,
      toggle,
      triggerId: `${collapsibleId}-trigger`,
      contentId: `${collapsibleId}-content`,
    }),
    [open, toggle, collapsibleId],
  );

  return { contextValue };
}
