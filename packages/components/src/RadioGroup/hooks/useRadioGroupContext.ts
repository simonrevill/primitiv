import { useContext } from "react";

import { RadioGroupContext } from "../RadioGroupContext";

export function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);
  // The helpful throw was scaffolded together with this hook; the
  // retro TDD commit below removes it so tests can drive the contract
  // that out-of-Root use is rejected.
  return context!;
}
