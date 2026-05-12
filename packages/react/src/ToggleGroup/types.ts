import { HTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from "react";

type ToggleGroupRootBaseProps = Omit<HTMLAttributes<HTMLDivElement>, "dir"> & {
  orientation?: "horizontal" | "vertical";
  dir?: "ltr" | "rtl";
  asChild?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

type SingleUncontrolledProps = {
  type: "single";
  defaultValue?: string;
  value?: never;
  onValueChange?: never;
};

type SingleControlledProps = {
  type: "single";
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  defaultValue?: never;
};

type MultipleUncontrolledProps = {
  type: "multiple";
  defaultValue?: string[];
  value?: never;
  onValueChange?: never;
};

type MultipleControlledProps = {
  type: "multiple";
  value: string[];
  onValueChange: (value: string[]) => void;
  defaultValue?: never;
};

export type ToggleGroupRootProps = ToggleGroupRootBaseProps &
  (
    | SingleUncontrolledProps
    | SingleControlledProps
    | MultipleUncontrolledProps
    | MultipleControlledProps
  );

export type ToggleGroupItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> & {
  value: string;
  disabled?: boolean;
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

export type ToggleGroupContextValue = {
  value: string[];
  toggle: (itemValue: string) => void;
  registerItem: (
    itemValue: string,
    element: HTMLButtonElement | null,
    disabled?: boolean,
  ) => void;
  itemValues: string[];
  disabledValues: Set<string>;
  focusItem: (itemValue: string) => void;
  focusedValue: string | undefined;
  setFocusedValue: (itemValue: string) => void;
  orientation: "horizontal" | "vertical";
  dir: "ltr" | "rtl";
};
