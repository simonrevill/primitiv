import { useContext } from "react";

import { RadioGroupItemContext } from "../RadioGroupItemContext";

export function useRadioGroupItemContext() {
  const context = useContext(RadioGroupItemContext);
  return context!;
}
