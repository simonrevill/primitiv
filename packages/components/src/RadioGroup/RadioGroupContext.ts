import { createStrictContext } from "../utils";

export type RadioGroupContextValue = {
  value: string | undefined;
  select: (value: string) => void;
  registerItem: (
    value: string,
    element: HTMLButtonElement | null,
    disabled?: boolean,
  ) => void;
  itemValues: string[];
  disabledValues: Set<string>;
  focusItem: (value: string) => void;
};

export const [RadioGroupContext, useRadioGroupContext] =
  createStrictContext<RadioGroupContextValue>(
    "RadioGroup sub-components must be rendered inside a <RadioGroup.Root>.",
  );
