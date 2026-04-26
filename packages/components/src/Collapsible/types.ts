import { ComponentProps, ReactNode } from "react";

type CollapsibleRootBaseProps = Omit<ComponentProps<"div">, "onChange">;

type CollapsibleRootUncontrolledProps = CollapsibleRootBaseProps & {
  defaultOpen?: boolean;
  open?: never;
  onOpenChange?: (open: boolean) => void;
};

type CollapsibleRootControlledProps = CollapsibleRootBaseProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
};

export type CollapsibleRootProps =
  | CollapsibleRootUncontrolledProps
  | CollapsibleRootControlledProps;

export type CollapsibleTriggerProps = ComponentProps<"button"> & {
  children: ReactNode;
};

export type CollapsibleContentProps = ComponentProps<"div"> & {
  children: ReactNode;
};

export type CollapsibleContextValue = {
  open: boolean;
  toggle: () => void;
  triggerId: string;
  contentId: string;
};
