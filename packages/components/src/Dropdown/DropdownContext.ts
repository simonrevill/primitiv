import { createContext, RefObject } from "react";

export type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export const DropdownContext = createContext<DropdownContextValue | null>(null);
