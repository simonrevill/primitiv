import { createStrictContext } from "../utils";

export type RadioGroupItemContextValue = {
  checked: boolean;
};

export const [RadioGroupItemContext, useRadioGroupItemContext] =
  createStrictContext<RadioGroupItemContextValue>(
    "RadioGroup.Indicator must be rendered inside a <RadioGroup.Item>.",
  );
