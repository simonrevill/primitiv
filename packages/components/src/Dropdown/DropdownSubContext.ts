import { createContext, RefObject } from "react";

export type DropdownSubContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerRef: RefObject<HTMLLIElement | null>;
};

export const DropdownSubContext =
  createContext<DropdownSubContextValue | null>(null);
