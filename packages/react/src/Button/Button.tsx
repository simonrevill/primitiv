import { Slot } from "../Slot";
import { ButtonProps } from "./types";

export function Button({
  asChild = false,
  type = "button",
  disabled,
  children,
  ref,
  ...rest
}: ButtonProps) {
  const rootProps = {
    ...rest,
    ref,
    disabled,
    "data-disabled": disabled ? "" : undefined,
  };

  if (asChild) {
    return <Slot {...rootProps}>{children}</Slot>;
  }

  return (
    <button type={type} {...rootProps}>
      {children}
    </button>
  );
}

Button.displayName = "Button";
