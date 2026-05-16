import { ComponentProps, ReactNode, Ref } from "react";

type RadioCardRootBaseProps = Omit<ComponentProps<"div">, "role"> & {
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
  asChild?: boolean;
};

type RadioCardRootUncontrolledProps = RadioCardRootBaseProps & {
  defaultValue?: string;
  value?: never;
  onValueChange?: (value: string) => void;
};

type RadioCardRootControlledProps = RadioCardRootBaseProps & {
  defaultValue?: never;
  value: string;
  onValueChange: (value: string) => void;
};

export type RadioCardRootProps =
  | RadioCardRootUncontrolledProps
  | RadioCardRootControlledProps;

export type RadioCardItemProps = Omit<
  ComponentProps<"button">,
  "type" | "role" | "aria-checked" | "value"
> & {
  value: string;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
  asChild?: boolean;
};

export type RadioCardIndicatorProps = ComponentProps<"span"> & {
  children?: ReactNode;
  forceMount?: boolean;
  asChild?: boolean;
};
