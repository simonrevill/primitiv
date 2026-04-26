import { ComponentProps, ReactNode } from "react";

export type CollapsibleRootProps = ComponentProps<"div"> & {
  defaultOpen?: boolean;
};

export type CollapsibleTriggerProps = ComponentProps<"button"> & {
  children: ReactNode;
};

export type CollapsibleContentProps = ComponentProps<"div"> & {
  children: ReactNode;
};

export type CollapsibleContextValue = {
  open: boolean;
  toggle: () => void;
  triggerId: string;
  contentId: string;
};
