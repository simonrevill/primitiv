import { useContext } from "react";
import { DropdownContentContext } from "../DropdownContentContext";

/**
 * Returns a callback that closes any direct-child sub-menu registered with
 * the enclosing {@link DropdownContent} / {@link DropdownSubContent}. Items
 * invoke this on mouse-enter so hovering a sibling dismisses an open sub,
 * mirroring the keyboard contract.
 */
export function useCloseSiblingSub() {
  const content = useContext(DropdownContentContext);
  return () => content?.closeOpenSubRef.current?.();
}
