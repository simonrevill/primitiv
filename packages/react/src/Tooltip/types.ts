import { ComponentProps, ReactNode } from "react";

export type TooltipProviderContextValue = {
  delayDuration: number;
  skipDelayDuration: number;
  isOpenGlobally: boolean;
  onOpenGlobally: () => void;
  onCloseGlobally: () => void;
};

export type TooltipContextValue = {
  open: boolean;
  contentId: string;
  disableHoverableContent: boolean;
  openWithDelay: () => void;
  openImmediate: () => void;
  closeImmediate: () => void;
  closeWithGrace: () => void;
  cancelGrace: () => void;
};

export type TooltipProviderProps = {
  children?: ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
};

type UncontrolledTooltipRootProps = {
  defaultOpen?: boolean;
  open?: never;
  onOpenChange?: (open: boolean) => void;
};

type ControlledTooltipRootProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: never;
};

export type TooltipRootProps = {
  children?: ReactNode;
  delayDuration?: number;
  disableHoverableContent?: boolean;
} & (UncontrolledTooltipRootProps | ControlledTooltipRootProps);

export type TooltipTriggerProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export type TooltipPortalProps = {
  children?: ReactNode;
  container?: HTMLElement;
  forceMount?: boolean;
};

export type TooltipContentProps = ComponentProps<"div"> & {
  forceMount?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
};

export type TooltipArrowProps = ComponentProps<"span"> & {
  asChild?: boolean;
};
