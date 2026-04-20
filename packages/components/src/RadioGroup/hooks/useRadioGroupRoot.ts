import { useCallback, useState } from "react";

type UseRadioGroupRootArgs = {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export function useRadioGroupRoot({
  defaultValue,
  onValueChange,
}: UseRadioGroupRootArgs) {
  const [value, setValue] = useState<string | undefined>(defaultValue);

  const select = useCallback(
    (next: string) => {
      setValue((prev) => {
        if (prev === next) return prev;
        onValueChange?.(next);
        return next;
      });
    },
    [onValueChange],
  );

  return { value, select };
}
