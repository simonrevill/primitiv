import { createStrictContext } from "../utils";

export type SwitchContextValue = {
  checked: boolean;
};

export const [SwitchContext, useSwitchContext] =
  createStrictContext<SwitchContextValue>(
    "Switch.Thumb must be rendered inside a <Switch.Root>.",
  );
