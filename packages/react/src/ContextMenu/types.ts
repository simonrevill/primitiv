import { ComponentProps, ReactNode, Ref } from "react";

type ContextMenuRootBaseProps = {
  children?: ReactNode;
};

type ContextMenuRootUncontrolledProps = ContextMenuRootBaseProps & {
  defaultOpen?: boolean;
  open?: never;
  onOpenChange?: (open: boolean) => void;
};

type ContextMenuRootControlledProps = ContextMenuRootBaseProps & {
  defaultOpen?: never;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type ContextMenuRootProps =
  | ContextMenuRootUncontrolledProps
  | ContextMenuRootControlledProps;

export type ContextMenuTriggerProps = ComponentProps<"span"> & {
  children?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
  asChild?: boolean;
  disabled?: boolean;
};

export type ContextMenuContentProps = Omit<
  ComponentProps<"menu">,
  "role" | "popover" | "id"
> & {
  children?: ReactNode;
  ref?: Ref<HTMLMenuElement>;
  asChild?: boolean;
};
