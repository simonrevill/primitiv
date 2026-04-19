import { ComponentProps, ReactNode, Ref } from "react";

export type RadioGroupRootProps = Omit<ComponentProps<"div">, "role"> & {
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

export type RadioGroupItemProps = Omit<
  ComponentProps<"button">,
  "type" | "role" | "aria-checked" | "value"
> & {
  value: string;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
};
