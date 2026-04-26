import { ComponentProps, ReactNode } from "react";

export type CollapsibleRootProps = ComponentProps<"div">;

export type CollapsibleTriggerProps = ComponentProps<"button"> & {
  children: ReactNode;
};

export type CollapsibleContentProps = ComponentProps<"div"> & {
  children: ReactNode;
};

export type CollapsibleContextValue = {
  open: boolean;
  triggerId: string;
  contentId: string;
};
