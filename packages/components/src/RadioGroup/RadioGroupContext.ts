import { createContext } from "react";

export type RadioGroupContextValue = {
  value: string | undefined;
  select: (value: string) => void;
  registerItem: (value: string, element: HTMLButtonElement | null) => void;
  itemValues: string[];
  focusItem: (value: string) => void;
};

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(
  null,
);
