import { createStrictContext } from "../utils";

import { CheckedState } from "./types";

export type CheckboxContextValue = {
  checked: CheckedState;
};

export const [CheckboxContext, useCheckboxContext] =
  createStrictContext<CheckboxContextValue>(
    "Checkbox sub-components must be rendered inside a <Checkbox.Root>.",
  );
