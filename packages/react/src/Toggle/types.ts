import { ButtonHTMLAttributes, ReactNode, Ref } from "react";

type UncontrolledToggleProps = {
  defaultPressed?: boolean;
  pressed?: never;
  onPressedChange?: never;
};

type ControlledToggleProps = {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  defaultPressed?: never;
};

type ToggleBaseProps = {
  disabled?: boolean;
  asChild?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export type ToggleProps = ToggleBaseProps &
  (UncontrolledToggleProps | ControlledToggleProps);
