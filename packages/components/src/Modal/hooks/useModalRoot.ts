import { useCallback, useId, useMemo, useState } from "react";

import { ModalContextValue } from "../types";

type UseModalRootArgs = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function useModalRoot({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: UseModalRootArgs) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;
  const contentId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const contextValue = useMemo<ModalContextValue>(
    () => ({ open, setOpen, contentId }),
    [open, setOpen, contentId],
  );

  return { contextValue };
}
