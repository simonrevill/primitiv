import { ComponentProps, ReactNode, Ref } from "react";

type CollapsibleRootBaseProps = Omit<ComponentProps<"div">, "onChange"> & {
  disabled?: boolean;
};

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

export type CollapsibleTriggerProps<
  T extends HTMLElement = HTMLButtonElement,
> = Omit<ComponentProps<"button">, "ref"> & {
  children: ReactNode;
  asChild?: boolean;
  /** Ref to the rendered element. Defaults to `HTMLButtonElement`; when using
   * `asChild`, specify the child's element type (e.g. `HTMLAnchorElement`). */
  ref?: Ref<T>;
};

export type CollapsibleContentProps = ComponentProps<"div"> & {
  children: ReactNode;
  forceMount?: boolean;
};

export type CollapsibleContextValue = {
  open: boolean;
  disabled: boolean;
  toggle: () => void;
  triggerId: string;
  contentId: string;
};
