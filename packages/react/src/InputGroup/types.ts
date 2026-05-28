import { ComponentProps, ReactNode, Ref } from "react";

export type InputGroupRootProps = ComponentProps<"div"> & {
  asChild?: boolean;
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
};

export type InputGroupAdornmentProps = ComponentProps<"span"> & {
  asChild?: boolean;
  ref?: Ref<HTMLSpanElement>;
  children?: ReactNode;
};
