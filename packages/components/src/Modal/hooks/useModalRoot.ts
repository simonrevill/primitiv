import { useCallback, useId, useMemo, useRef, useState } from "react";

import { ModalContentCallbacks, ModalContextValue } from "../types";

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
  const contentCallbacksRef = useRef<ModalContentCallbacks>({});

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
    () => ({ open, setOpen, contentId, contentCallbacksRef }),
    [open, setOpen, contentId],
  );

  return { contextValue };
}
