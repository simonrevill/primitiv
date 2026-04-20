import { createContext } from "react";

export type RadioGroupItemContextValue = {
  checked: boolean;
};

export const RadioGroupItemContext =
  createContext<RadioGroupItemContextValue | null>(null);
