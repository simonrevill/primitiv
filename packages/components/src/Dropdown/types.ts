import { ComponentProps, ReactNode, Ref } from "react";

import { CheckedState } from "../Checkbox/types";

type DropdownRootBaseProps = {
  children?: ReactNode;
};

type DropdownRootUncontrolledProps = DropdownRootBaseProps & {
  defaultOpen?: boolean;
  open?: never;
  onOpenChange?: (open: boolean) => void;
};

type DropdownRootControlledProps = DropdownRootBaseProps & {
  defaultOpen?: never;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type DropdownRootProps =
  | DropdownRootUncontrolledProps
  | DropdownRootControlledProps;

export type DropdownTriggerProps = Omit<
  ComponentProps<"button">,
  "aria-haspopup" | "aria-expanded" | "aria-controls"
> & {
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
  asChild?: boolean;
};

export type DropdownContentProps = Omit<
  ComponentProps<"menu">,
  "role" | "popover" | "id"
> & {
  children?: ReactNode;
  ref?: Ref<HTMLMenuElement>;
  asChild?: boolean;
};

export type DropdownItemProps = Omit<
  ComponentProps<"li">,
  "role" | "tabIndex"
> & {
  children?: ReactNode;
  ref?: Ref<HTMLLIElement>;
  asChild?: boolean;
  disabled?: boolean;
  /**
   * Fires when the item is activated (click, Enter, or Space). Called
   * with an event whose `preventDefault()` skips the auto-close that
   * Dropdown performs after selection.
   */
  onSelect?: (event: Event) => void;
};

export type DropdownSeparatorProps = Omit<
  ComponentProps<"li">,
  "role" | "children"
> & {
  ref?: Ref<HTMLLIElement>;
  asChild?: boolean;
};

export type DropdownGroupProps = Omit<ComponentProps<"li">, "role"> & {
  children?: ReactNode;
  ref?: Ref<HTMLLIElement>;
  asChild?: boolean;
};

export type DropdownLabelProps = ComponentProps<"li"> & {
  children?: ReactNode;
  ref?: Ref<HTMLLIElement>;
  asChild?: boolean;
};

type DropdownCheckboxItemBaseProps = Omit<
  ComponentProps<"li">,
  "role" | "tabIndex" | "aria-checked" | "defaultChecked"
> & {
  children?: ReactNode;
  ref?: Ref<HTMLLIElement>;
  asChild?: boolean;
  disabled?: boolean;
  /**
   * Fires when activation completes and the close auto-fires. Call
   * `event.preventDefault()` to keep the menu open after toggling.
   */
  onSelect?: (event: Event) => void;
};

type DropdownCheckboxItemUncontrolledProps = DropdownCheckboxItemBaseProps & {
  defaultChecked?: CheckedState;
  checked?: never;
  onCheckedChange?: (checked: boolean) => void;
};

type DropdownCheckboxItemControlledProps = DropdownCheckboxItemBaseProps & {
  defaultChecked?: never;
  checked: CheckedState;
  onCheckedChange: (checked: boolean) => void;
};

export type DropdownCheckboxItemProps =
  | DropdownCheckboxItemUncontrolledProps
  | DropdownCheckboxItemControlledProps;
