import { ReactNode } from "react";

import { useModalContext } from "./hooks";

function ModalRoot({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

function ModalTrigger({ children }: { children?: ReactNode }) {
  useModalContext();
  return <>{children}</>;
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

function ModalClose({ children }: { children?: ReactNode }) {
  useModalContext();
  return <>{children}</>;
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
