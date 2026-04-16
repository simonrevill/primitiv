import { HTMLAttributes, ReactNode } from "react";

export type SlotProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
};
