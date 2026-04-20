import { useContext } from "react";

import { DropdownContext } from "../DropdownContext";

export function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error(
      "Dropdown sub-components must be rendered inside a <Dropdown.Root>.",
    );
  }
  return context;
}
