import { ComponentProps, ReactNode } from "react";

export type ModalContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type ModalRootProps = {
  children?: ReactNode;
  defaultOpen?: boolean;
};

export type ModalTriggerProps = ComponentProps<"button">;

export type ModalCloseProps = ComponentProps<"button">;
