import { useEffect, useRef } from "react";

import { useModalContext } from "./useModalContext";

export function useModalContent() {
  const { open, setOpen, contentId, contentCallbacksRef } = useModalContext();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => setOpen(false);
    const handleCancel = (event: Event) => {
      contentCallbacksRef.current?.onEscapeKeyDown?.(event);
      const consumerVetoed = event.defaultPrevented;
      // Always block the browser's native auto-close so React drives the
      // open state — otherwise the native close fires a `close` event and
      // we'd race with React's effect-driven dialog.close().
      event.preventDefault();
      if (consumerVetoed) return;
      setOpen(false);
    };
    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [setOpen, contentCallbacksRef]);

  return { ref, open, contentId };
}
