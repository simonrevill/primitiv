import { useContext } from "react";

import { CheckboxContext } from "../CheckboxContext";

export function useCheckboxContext() {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error(
      "Checkbox sub-components must be rendered inside a <Checkbox.Root>.",
    );
  }
  return context;
}
