import { createContext } from "react";

export type DropdownRadioGroupContextValue = {
  value: string | undefined;
  select: (value: string) => void;
};

export const DropdownRadioGroupContext =
  createContext<DropdownRadioGroupContextValue | null>(null);
