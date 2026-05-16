import { ButtonHTMLAttributes, ComponentProps, ReactNode, Ref } from "react";

type SwitchRootBaseProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "role" | "aria-checked"
> & {
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

type SwitchRootUncontrolledProps = SwitchRootBaseProps & {
  defaultChecked?: boolean;
  checked?: never;
  onCheckedChange?: (checked: boolean) => void;
};

type SwitchRootControlledProps = SwitchRootBaseProps & {
  defaultChecked?: never;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export type SwitchRootProps =
  | SwitchRootUncontrolledProps
  | SwitchRootControlledProps;

export type SwitchThumbProps = ComponentProps<"span"> & {
  children?: ReactNode;
  asChild?: boolean;
};
