import { useCallback, useState } from "react";

type UseCheckboxRootArgs = {
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function useCheckboxRoot({
  defaultChecked,
  checked: controlledChecked,
  onCheckedChange,
}: UseCheckboxRootArgs) {
  const isControlled = controlledChecked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(
    defaultChecked ?? false,
  );
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const toggle = useCallback(() => {
    const next = !checked;
    if (!isControlled) setUncontrolledChecked(next);
    onCheckedChange?.(next);
  }, [checked, isControlled, onCheckedChange]);

  return { checked, toggle };
}
