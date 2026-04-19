import { ComponentProps, MouseEvent, ReactNode, RefObject } from "react";

export type ModalContentCallbacks = {
  onEscapeKeyDown?: (event: Event) => void;
  onPointerDownOutside?: (event: MouseEvent<HTMLDivElement>) => void;
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

export type ModalContentProps = ComponentProps<"dialog"> & ModalContentCallbacks;

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

export type ModalPortalProps = {
  children?: ReactNode;
  container?: HTMLElement;
};

export type ModalOverlayProps = ComponentProps<"div">;
