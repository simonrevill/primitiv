import { createContext } from "react";

export type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
};

export const DropdownContext = createContext<DropdownContextValue | null>(null);
