import { ComponentProps, ReactNode, Ref, RefObject } from "react";

export type ModalImperativeApi = {
  open: () => void;
  close: () => void;
};

export type ModalContentCallbacks = {
  onEscapeKeyDown?: (event: Event) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
};

export type ModalContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  contentCallbacksRef: RefObject<ModalContentCallbacks>;
  titleId: string | undefined;
  descriptionId: string | undefined;
  registerTitle: (id: string | undefined) => void;
  registerDescription: (id: string | undefined) => void;
};

export type ModalContentProps = ComponentProps<"dialog"> &
  ModalContentCallbacks;

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
} & (UncontrolledModalRootProps | ControlledModalRootProps) & {
    ref?: Ref<ModalImperativeApi>;
  };

export type ModalTriggerProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export type ModalCloseProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export type ModalPortalProps = {
  children?: ReactNode;
  container?: HTMLElement;
  forceMount?: boolean;
};

export type ModalOverlayProps = ComponentProps<"div"> & {
  asChild?: boolean;
  forceMount?: boolean;
};

export type ModalTitleProps = {
  children?: ReactNode;
  asChild?: boolean;
};

export type ModalDescriptionProps = {
  children?: ReactNode;
  asChild?: boolean;
};
