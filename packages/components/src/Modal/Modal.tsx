import { Ref, ReactNode } from "react";
import { createPortal } from "react-dom";

import { composeEventHandlers, composeRefs } from "../Slot";

import { ModalProvider } from "./ModalContext";
import { useModalContent, useModalContext, useModalRoot } from "./hooks";
import {
  ModalCloseProps,
  ModalContentProps,
  ModalPortalProps,
  ModalRootProps,
  ModalTriggerProps,
} from "./types";

function ModalRoot(props: ModalRootProps) {
  const { children, defaultOpen, open, onOpenChange } = props;
  const { contextValue } = useModalRoot({ defaultOpen, open, onOpenChange });
  return <ModalProvider value={contextValue}>{children}</ModalProvider>;
}

function ModalTrigger({ onClick, type, ...rest }: ModalTriggerProps) {
  const { open, setOpen, contentId } = useModalContext();
  return (
    <button
      type={type ?? "button"}
      {...rest}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={composeEventHandlers(onClick, () => setOpen(true))}
    />
  );
}

function ModalPortal({ children, container }: ModalPortalProps) {
  const { open } = useModalContext();
  if (!open) return null;
  const target = container ?? (typeof document !== "undefined" ? document.body : null);
  if (!target) return null;
  return createPortal(children, target);
}

function ModalOverlay() {
  useModalContext();
  return null;
}

function ModalContent({
  children,
  id,
  ref: externalRef,
  ...rest
}: ModalContentProps & { ref?: Ref<HTMLDialogElement> }) {
  const { ref: innerRef, open, contentId } = useModalContent();
  const composedRef = externalRef
    ? composeRefs(innerRef, externalRef)
    : innerRef;
  return (
    <dialog
      ref={composedRef}
      id={id ?? contentId}
      data-state={open ? "open" : "closed"}
      {...rest}
    >
      {children}
    </dialog>
  );
}

function ModalTitle({ children }: { children?: ReactNode }) {
  useModalContext();
  return <>{children}</>;
}

function ModalDescription({ children }: { children?: ReactNode }) {
  useModalContext();
  return <>{children}</>;
}

function ModalClose({ onClick, ...rest }: ModalCloseProps) {
  const { setOpen } = useModalContext();
  return (
    <button
      type="button"
      onClick={composeEventHandlers(onClick, () => setOpen(false))}
      {...rest}
    />
  );
}

type TModalCompound = typeof ModalRoot & {
  Root: typeof ModalRoot;
  Trigger: typeof ModalTrigger;
  Portal: typeof ModalPortal;
  Overlay: typeof ModalOverlay;
  Content: typeof ModalContent;
  Title: typeof ModalTitle;
  Description: typeof ModalDescription;
  Close: typeof ModalClose;
};

const ModalCompound: TModalCompound = Object.assign(ModalRoot, {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Portal: ModalPortal,
  Overlay: ModalOverlay,
  Content: ModalContent,
  Title: ModalTitle,
  Description: ModalDescription,
  Close: ModalClose,
});

export { ModalCompound as Modal };
