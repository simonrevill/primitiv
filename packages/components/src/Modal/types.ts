import { ComponentProps, ReactNode } from "react";

export type ModalContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type UncontrolledModalRootProps = {
  defaultOpen?: boolean;
  open?: never;
  onOpenChange?: (open: boolean) => void;
};

type ControlledModalRootProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
};

export type ModalRootProps = {
  children?: ReactNode;
} & (UncontrolledModalRootProps | ControlledModalRootProps);

export type ModalTriggerProps = ComponentProps<"button">;

export type ModalCloseProps = ComponentProps<"button">;
