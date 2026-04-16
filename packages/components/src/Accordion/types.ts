import { ComponentProps, ReactNode, ReactElement } from "react";
import { HeadingLevel } from "../types";

type AccordionRootBaseProps = ComponentProps<"div"> & {
  multiple?: boolean;
  orientation?: "vertical" | "horizontal";
};

type AccordionRootUncontrolledProps = AccordionRootBaseProps & {
  defaultValue?: string;
  value?: never;
  onValueChange?: never;
};

type AccordionRootControlledProps = AccordionRootBaseProps & {
  defaultValue?: never;
  value: string[];
  onValueChange: (values: string[]) => void;
};

export type AccordionRootProps =
  | AccordionRootUncontrolledProps
  | AccordionRootControlledProps;

export type AccordionItemProps = ComponentProps<"div"> & {
  children: ReactNode;
  value?: string; // Optional - if not provided, useId() will generate one
};

export type AccordionTriggerProps = Omit<ComponentProps<"button">, "disabled"> & {
  children: ReactNode;
  disabled?: boolean;
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
