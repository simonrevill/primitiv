import { useContext } from "react";

import { DropdownContext } from "../DropdownContext";

export function useDropdownContext() {
  return useContext(DropdownContext)!;
}
