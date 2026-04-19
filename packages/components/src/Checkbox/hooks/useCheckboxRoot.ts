import { useCallback, useState } from "react";

import { CheckedState } from "../types";

type UseCheckboxRootArgs = {
  defaultChecked?: CheckedState;
  checked?: CheckedState;
  onCheckedChange?: (checked: boolean) => void;
};

export function useCheckboxRoot({
  defaultChecked,
  checked: controlledChecked,
  onCheckedChange,
}: UseCheckboxRootArgs) {
  const isControlled = controlledChecked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState<CheckedState>(
    defaultChecked ?? false,
  );
  const checked: CheckedState = isControlled
    ? controlledChecked
    : uncontrolledChecked;

  const toggle = useCallback(() => {
    // Indeterminate resolves to checked per the WAI-ARIA tri-state
    // convention; boolean flips.
    const next = checked === "indeterminate" ? true : !checked;
    if (!isControlled) setUncontrolledChecked(next);
    onCheckedChange?.(next);
  }, [checked, isControlled, onCheckedChange]);

  return { checked, toggle };
}
