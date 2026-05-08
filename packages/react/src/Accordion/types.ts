import { ComponentProps, ReactNode, Ref } from "react";
import { HeadingLevel } from "../types";

type AccordionRootBaseProps = ComponentProps<"div"> & {
  multiple?: boolean;
  orientation?: "vertical" | "horizontal";
  dir?: AccordionReadingDirection;
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

export type AccordionReadingDirection = "ltr" | "rtl";

export type AccordionRootProps =
  | AccordionRootUncontrolledProps
  | AccordionRootControlledProps;

export type AccordionItemProps = ComponentProps<"div"> & {
  children: ReactNode;
  value?: string; // Optional - if not provided, useId() will generate one
};

export type AccordionTriggerProps<
  T extends HTMLElement = HTMLButtonElement,
> = Omit<ComponentProps<"button">, "disabled" | "ref"> & {
  children: ReactNode;
  disabled?: boolean;
  asChild?: boolean;
  /** Ref to the rendered element. Defaults to `HTMLButtonElement`; when using
   * `asChild`, specify the child's element type (e.g. `HTMLAnchorElement`). */
  ref?: Ref<T>;
};

export type AccordionHeaderProps = ComponentProps<"h3"> & {
  children: ReactNode;
  level?: HeadingLevel;
};

export type AccordionContentProps = ComponentProps<"div"> & {
  children: ReactNode;
  forceMount?: boolean;
};

export type AccordionTriggerIconProps = {
  children: ReactNode;
};

export type AccordionContextValue = {
  accordionId: string;
  expandedItems: Set<string>;
  orientation: "vertical" | "horizontal";
  dir: AccordionReadingDirection;
  toggleItem: (itemId: string) => void;
  registerTrigger: (
    itemId: string,
    element: HTMLButtonElement | null,
    disabled?: boolean,
  ) => void;
  registeredTriggerItemIds: string[];
  disabledItemIds: Set<string>;
  focusTrigger: (itemId: string) => void;
  registerPanel: (itemId: string) => void;
  unregisterPanel: (itemId: string) => void;
};

export type AccordionItemContextValue = {
  buttonId: string;
  panelId: string;
  itemId: string;
  isExpanded: boolean;
};
