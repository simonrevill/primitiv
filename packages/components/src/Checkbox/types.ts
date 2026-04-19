import { ComponentProps, ReactNode, Ref } from "react";

export type CheckedState = boolean | "indeterminate";

export type CheckboxIndicatorProps = ComponentProps<"span"> & {
  children?: ReactNode;
  forceMount?: boolean;
  asChild?: boolean;
};

type CheckboxRootBaseProps = Omit<
  ComponentProps<"button">,
  "type" | "role" | "aria-checked" | "defaultChecked"
> & {
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

type CheckboxRootUncontrolledProps = CheckboxRootBaseProps & {
  defaultChecked?: CheckedState;
  checked?: never;
  onCheckedChange?: (checked: boolean) => void;
};

type CheckboxRootControlledProps = CheckboxRootBaseProps & {
  defaultChecked?: never;
  checked: CheckedState;
  onCheckedChange: (checked: boolean) => void;
};

export type CheckboxRootProps =
  | CheckboxRootUncontrolledProps
  | CheckboxRootControlledProps;
