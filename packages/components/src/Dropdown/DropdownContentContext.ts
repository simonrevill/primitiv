import { createContext, RefObject } from "react";

/**
 * Content-scoped context provided by {@link DropdownContent} and
 * {@link DropdownSubContent}. Holds a ref to a single "currently open
 * direct-child sub" close callback so that sibling items can dismiss the
 * open sub on hover, mirroring the keyboard contract (focus returning to
 * the parent menu closes the sub).
 */
export type DropdownContentContextValue = {
  closeOpenSubRef: RefObject<(() => void) | null>;
};

export const DropdownContentContext =
  createContext<DropdownContentContextValue | null>(null);
