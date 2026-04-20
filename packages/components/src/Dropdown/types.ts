import { ComponentProps, ReactNode, Ref } from "react";

type DropdownRootBaseProps = {
  children?: ReactNode;
};

type DropdownRootUncontrolledProps = DropdownRootBaseProps & {
  defaultOpen?: boolean;
  open?: never;
  onOpenChange?: (open: boolean) => void;
};

type DropdownRootControlledProps = DropdownRootBaseProps & {
  defaultOpen?: never;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type DropdownRootProps =
  | DropdownRootUncontrolledProps
  | DropdownRootControlledProps;

export type DropdownTriggerProps = Omit<
  ComponentProps<"button">,
  "aria-haspopup" | "aria-expanded" | "aria-controls"
> & {
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
  asChild?: boolean;
};
