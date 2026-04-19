import { Ref, useEffect, useId } from "react";
import { createPortal } from "react-dom";

import { Slot, composeEventHandlers, composeRefs } from "../Slot";

import { ModalProvider } from "./ModalContext";
import { useModalContent, useModalContext, useModalRoot } from "./hooks";
import {
  ModalCloseProps,
  ModalContentProps,
  ModalDescriptionProps,
  ModalImperativeApi,
  ModalOverlayProps,
  ModalPortalProps,
  ModalRootProps,
  ModalTitleProps,
  ModalTriggerProps,
} from "./types";

function ModalRoot({
  ref,
  ...props
}: ModalRootProps & { ref?: Ref<ModalImperativeApi> }) {
  const { children, defaultOpen, open, onOpenChange } = props;
  const { contextValue } = useModalRoot(
    { defaultOpen, open, onOpenChange },
    ref,
  );
  return <ModalProvider value={contextValue}>{children}</ModalProvider>;
}

function ModalTrigger({
  onClick,
  type,
  asChild = false,
  ...rest
}: ModalTriggerProps) {
  const { open, setOpen, contentId } = useModalContext();
  const triggerProps = {
    ...rest,
    "aria-haspopup": "dialog" as const,
    "aria-expanded": open,
    "aria-controls": contentId,
    onClick: composeEventHandlers(onClick, () => setOpen(true)),
  };
  if (asChild) {
    return <Slot {...triggerProps} />;
  }
  return <button type={type ?? "button"} {...triggerProps} />;
}

function ModalPortal({ children, container }: ModalPortalProps) {
  const { open } = useModalContext();
  if (!open) return null;
  const target = container ?? (typeof document !== "undefined" ? document.body : null);
  if (!target) return null;
  return createPortal(children, target);
}

function ModalOverlay({ onClick, asChild = false, ...rest }: ModalOverlayProps) {
  const { open, setOpen, contentCallbacksRef } = useModalContext();
  if (!open) return null;
  const overlayProps = {
    ...rest,
    "aria-hidden": "true" as const,
    "data-state": "open" as const,
    onClick: composeEventHandlers(onClick, (event) => {
      contentCallbacksRef.current?.onPointerDownOutside?.(event);
      if (event.defaultPrevented) return;
      setOpen(false);
    }),
  };
  if (asChild) {
    return <Slot {...overlayProps} />;
  }
  return <div {...overlayProps} />;
}

function ModalContent({
  children,
  id,
  onEscapeKeyDown,
  onPointerDownOutside,
  ref: externalRef,
  ...rest
}: ModalContentProps & { ref?: Ref<HTMLDialogElement> }) {
  const { ref: innerRef, open, contentId } = useModalContent();
  const { contentCallbacksRef, titleId, descriptionId } = useModalContext();
  // Keep the ref pointed at the latest callbacks so event handlers wired
  // through context (Overlay's onClick, native cancel) always see the most
  // recent consumer props across re-renders.
  contentCallbacksRef.current = { onEscapeKeyDown, onPointerDownOutside };
  const composedRef = externalRef
    ? composeRefs(innerRef, externalRef)
    : innerRef;
  return (
    <dialog
      ref={composedRef}
      id={id ?? contentId}
      data-state={open ? "open" : "closed"}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      {...rest}
    >
      {children}
    </dialog>
  );
}

function ModalTitle({ children, asChild = false }: ModalTitleProps) {
  const { registerTitle } = useModalContext();
  const id = useId();
  useEffect(() => {
    registerTitle(id);
    return () => registerTitle(undefined);
  }, [registerTitle, id]);
  if (asChild) {
    return <Slot id={id}>{children}</Slot>;
  }
  return <h2 id={id}>{children}</h2>;
}

function ModalDescription({
  children,
  asChild = false,
}: ModalDescriptionProps) {
  const { registerDescription } = useModalContext();
  const id = useId();
  useEffect(() => {
    registerDescription(id);
    return () => registerDescription(undefined);
  }, [registerDescription, id]);
  if (asChild) {
    return <Slot id={id}>{children}</Slot>;
  }
  return <p id={id}>{children}</p>;
}

function ModalClose({ onClick, asChild = false, ...rest }: ModalCloseProps) {
  const { setOpen } = useModalContext();
  const closeProps = {
    ...rest,
    onClick: composeEventHandlers(onClick, () => setOpen(false)),
  };
  if (asChild) {
    return <Slot {...closeProps} />;
  }
  return <button type="button" {...closeProps} />;
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
