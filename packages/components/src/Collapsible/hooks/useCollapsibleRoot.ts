import { useCallback, useId, useMemo, useState } from "react";

export function useCollapsibleRoot(defaultOpen: boolean) {
  const collapsibleId = useId();
  const [open, setOpen] = useState(defaultOpen);

  const toggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

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
