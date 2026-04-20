import { createContext } from "react";

export type RadioGroupContextValue = {
  value: string | undefined;
  select: (value: string) => void;
};

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(
  null,
);
