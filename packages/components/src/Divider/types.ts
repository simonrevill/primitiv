import { ComponentProps } from "react";

export type DividerProps = ComponentProps<"span"> & {
  orientation?: "horizontal" | "vertical";
};
