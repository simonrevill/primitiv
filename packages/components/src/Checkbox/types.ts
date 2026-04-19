import { ComponentProps, Ref } from "react";

export type CheckboxRootProps = Omit<
  ComponentProps<"button">,
  "type" | "role" | "aria-checked"
> & {
  ref?: Ref<HTMLButtonElement>;
};
