import { createContext } from "react";

export type DropdownGroupContextValue = {
  labelId: string;
};

export const DropdownGroupContext =
  createContext<DropdownGroupContextValue | null>(null);
