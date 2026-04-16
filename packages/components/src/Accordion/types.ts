import { ComponentProps, ReactNode, ReactElement } from "react";
import { HeadingLevel } from "../types";

export type AccordionRootProps = ComponentProps<"div"> & {
  multiple?: boolean;
  defaultValue?: string;
  orientation?: "vertical" | "horizontal";
};

export type AccordionItemProps = ComponentProps<"div"> & {
  children: ReactNode;
  value?: string; // Optional - if not provided, useId() will generate one
};

export type AccordionTriggerProps = ComponentProps<"button"> & {
  children: ReactNode;
};

export type AccordionHeaderProps = ComponentProps<"h3"> & {
  children: ReactNode;
  level?: HeadingLevel;
};

export type AccordionContentProps = ComponentProps<"div"> & {
  children: ReactNode;
};

export type AccordionTriggerIconProps = {
  icon: ReactElement;
};

export type AccordionContextValue = {
  accordionId: string;
  expandedItems: Set<string>;
  orientation: "vertical" | "horizontal";
  toggleItem: (itemId: string) => void;
  registerTrigger: (itemId: string, element: HTMLButtonElement | null) => void;
  getTriggers: () => HTMLButtonElement[];
};

export type AccordionItemContextValue = {
  buttonId: string;
  panelId: string;
  itemId: string;
  isExpanded: boolean;
};
