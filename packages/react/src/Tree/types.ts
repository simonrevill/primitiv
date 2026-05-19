import { ComponentProps, ReactNode } from "react";

export type TreeRootProps = ComponentProps<"div"> & {
  children: ReactNode;
};

export type TreeItemProps = ComponentProps<"div"> & {
  /** Stable identifier for this item, unique within the tree. */
  value: string;
  children: ReactNode;
};
