import { InputProps } from "./types";

export function Input({ type = "text", disabled, ref, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      type={type}
      ref={ref}
      disabled={disabled}
      data-disabled={disabled ? "" : undefined}
    />
  );
}

Input.displayName = "Input";
