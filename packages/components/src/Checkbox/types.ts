import { ComponentProps, Ref } from "react";

type CheckboxRootBaseProps = Omit<
  ComponentProps<"button">,
  "type" | "role" | "aria-checked" | "defaultChecked"
> & {
  ref?: Ref<HTMLButtonElement>;
};

type CheckboxRootUncontrolledProps = CheckboxRootBaseProps & {
  defaultChecked?: boolean;
  checked?: never;
  onCheckedChange?: (checked: boolean) => void;
};

type CheckboxRootControlledProps = CheckboxRootBaseProps & {
  defaultChecked?: never;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export type CheckboxRootProps =
  | CheckboxRootUncontrolledProps
  | CheckboxRootControlledProps;
