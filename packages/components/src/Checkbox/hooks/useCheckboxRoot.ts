import { useCallback, useState } from "react";

type UseCheckboxRootArgs = {
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function useCheckboxRoot({
  defaultChecked,
  onCheckedChange,
}: UseCheckboxRootArgs) {
  const [checked, setChecked] = useState(defaultChecked ?? false);

  const toggle = useCallback(() => {
    const next = !checked;
    setChecked(next);
    onCheckedChange?.(next);
  }, [checked, onCheckedChange]);

  return { checked, toggle };
}
