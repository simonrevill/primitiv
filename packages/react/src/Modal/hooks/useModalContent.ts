import { useEffect, useRef } from "react";

import { useModalContext } from "./useModalContext";

export function useModalContent() {
  const { open, setOpen, contentId, contentCallbacksRef } = useModalContext();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // React guarantees the ref is populated before effects run for a
    // successfully-committed element, and Content always renders the
    // dialog — so ref.current is non-null here.
    const dialog = ref.current as HTMLDialogElement;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current as HTMLDialogElement;
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
    const handlePointerDown = (event: PointerEvent) => {
      // Native <dialog>.showModal() puts the dialog in the top layer and
      // paints its own ::backdrop over any sibling overlay, so clicks on
      // the visual backdrop target the <dialog> itself — not the overlay.
      // Bounding-rect check: pointer inside the dialog's box (content or
      // padding) is "inside"; anything else is a backdrop click.
      const rect = dialog.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (inside) return;
      contentCallbacksRef.current?.onPointerDownOutside?.(event);
      if (event.defaultPrevented) return;
      setOpen(false);
    };
    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("pointerdown", handlePointerDown);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [setOpen, contentCallbacksRef]);

  return { ref, open, contentId };
}
