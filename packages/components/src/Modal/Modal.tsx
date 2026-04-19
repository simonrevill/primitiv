import { ReactNode } from "react";

import { composeEventHandlers } from "../Slot";

import { ModalProvider } from "./ModalContext";
import { useModalContext, useModalRoot } from "./hooks";
import {
  ModalCloseProps,
  ModalRootProps,
  ModalTriggerProps,
} from "./types";

function ModalRoot(props: ModalRootProps) {
  const { children, defaultOpen, open, onOpenChange } = props;
  const { contextValue } = useModalRoot({ defaultOpen, open, onOpenChange });
  return <ModalProvider value={contextValue}>{children}</ModalProvider>;
}

function ModalTrigger({ onClick, ...rest }: ModalTriggerProps) {
  const { open, setOpen } = useModalContext();
  return (
    <button
      type="button"
      {...rest}
      aria-expanded={open}
      onClick={composeEventHandlers(onClick, () => setOpen(true))}
    />
  );
}

function ModalPortal({ children }: { children?: ReactNode }) {
  useModalContext();
  return <>{children}</>;
}

function ModalOverlay() {
  useModalContext();
  return null;
}

function ModalContent({ children }: { children?: ReactNode }) {
  useModalContext();
  return <>{children}</>;
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
