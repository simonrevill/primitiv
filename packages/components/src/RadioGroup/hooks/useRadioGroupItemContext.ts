import { useContext } from "react";

import { RadioGroupItemContext } from "../RadioGroupItemContext";

export function useRadioGroupItemContext() {
  const context = useContext(RadioGroupItemContext);
  if (!context) {
    throw new Error(
      "RadioGroup.Indicator must be rendered inside a <RadioGroup.Item>.",
    );
  }
  return context;
}
