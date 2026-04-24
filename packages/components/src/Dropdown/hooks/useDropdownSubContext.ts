import { useContext } from "react";
import { DropdownSubContext } from "../DropdownSubContext";

export function useDropdownSubContext() {
  const context = useContext(DropdownSubContext);
  if (!context) {
    throw new Error(
      "Dropdown.SubTrigger and Dropdown.SubContent must be rendered inside a <Dropdown.Sub>.",
    );
  }
  return context;
}
