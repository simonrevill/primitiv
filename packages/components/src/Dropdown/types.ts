import { ComponentProps, ReactNode, Ref } from "react";

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
