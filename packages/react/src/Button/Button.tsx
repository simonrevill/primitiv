import { ButtonProps } from "./types";

export function Button({
  type = "button",
  disabled,
  children,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      ref={ref}
      disabled={disabled}
      data-disabled={disabled ? "" : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.displayName = "Button";
