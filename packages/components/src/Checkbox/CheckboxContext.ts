import { createContext } from "react";

import { CheckedState } from "./types";

export type CheckboxContextValue = {
  checked: CheckedState;
};

export const CheckboxContext = createContext<CheckboxContextValue | null>(
  null,
);
