import { useContext } from "react";

import { RadioGroupContext } from "../RadioGroupContext";

export function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error(
      "RadioGroup sub-components must be rendered inside a <RadioGroup.Root>.",
    );
  }
  return context;
}
