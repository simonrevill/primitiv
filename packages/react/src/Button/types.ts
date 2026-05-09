import { ComponentProps, ReactNode, Ref } from "react";

export type ButtonProps = Omit<ComponentProps<"button">, "type"> & {
  type?: "button" | "submit" | "reset";
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
  children?: ReactNode;
};
