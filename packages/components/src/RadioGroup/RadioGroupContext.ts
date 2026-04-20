import { createContext } from "react";

export type RadioGroupContextValue = {
  value: string | undefined;
  select: (value: string) => void;
  registerItem: (value: string, element: HTMLButtonElement | null) => void;
  itemValues: string[];
};

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(
  null,
);
