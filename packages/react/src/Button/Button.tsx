import { ButtonProps } from "./types";

export function Button({
  type = "button",
  disabled,
  children,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} ref={ref} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

Button.displayName = "Button";
