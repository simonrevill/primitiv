import { createStrictContext } from "../utils";

export type RadioCardItemContextValue = {
  checked: boolean;
};

export const [RadioCardItemContext, useRadioCardItemContext] =
  createStrictContext<RadioCardItemContextValue>(
    "RadioCard.Indicator must be rendered inside a <RadioCard.Item>.",
  );
