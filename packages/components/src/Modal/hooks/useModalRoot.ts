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
  const [titleId, setTitleId] = useState<string | undefined>(undefined);
  const [descriptionId, setDescriptionId] = useState<string | undefined>(
    undefined,
  );

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const registerTitle = useCallback((id: string | undefined) => {
    setTitleId(id);
  }, []);

  const registerDescription = useCallback((id: string | undefined) => {
    setDescriptionId(id);
  }, []);

  const contextValue = useMemo<ModalContextValue>(
    () => ({
      open,
      setOpen,
      contentId,
      contentCallbacksRef,
      titleId,
      descriptionId,
      registerTitle,
      registerDescription,
    }),
    [
      open,
      setOpen,
      contentId,
      titleId,
      descriptionId,
      registerTitle,
      registerDescription,
    ],
  );

  return { contextValue };
}
