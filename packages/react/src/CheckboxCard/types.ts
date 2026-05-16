import { ComponentProps, ReactNode, Ref } from "react";

export type CheckedState = boolean | "indeterminate";

export type CheckboxCardIndicatorProps = ComponentProps<"span"> & {
  children?: ReactNode;
  forceMount?: boolean;
  asChild?: boolean;
};

type CheckboxCardRootBaseProps = Omit<
  ComponentProps<"button">,
  "type" | "role" | "aria-checked" | "defaultChecked"
> & {
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

type CheckboxCardRootUncontrolledProps = CheckboxCardRootBaseProps & {
  defaultChecked?: CheckedState;
  checked?: never;
  onCheckedChange?: (checked: boolean) => void;
};

type CheckboxCardRootControlledProps = CheckboxCardRootBaseProps & {
  defaultChecked?: never;
  checked: CheckedState;
  onCheckedChange: (checked: boolean) => void;
};

export type CheckboxCardRootProps =
  | CheckboxCardRootUncontrolledProps
  | CheckboxCardRootControlledProps;
