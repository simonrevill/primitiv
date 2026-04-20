import { useCallback, useRef, useState } from "react";

type UseRadioGroupRootArgs = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

export function useRadioGroupRoot({
  defaultValue,
  value: controlledValue,
  onValueChange,
}: UseRadioGroupRootArgs) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(defaultValue);
  const value = isControlled ? controlledValue : uncontrolledValue;

  const select = useCallback(
    (next: string) => {
      if (value === next) return;
      if (!isControlled) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [value, isControlled, onValueChange],
  );

  // Track registered item elements in a ref (for future focus handling)
  // and their values as state so re-renders fire when items mount or
  // unmount — required for the roving-tabindex home base.
  const itemsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [itemValues, setItemValues] = useState<string[]>([]);

  const registerItem = useCallback(
    (itemValue: string, element: HTMLButtonElement | null) => {
      if (element) {
        itemsRef.current.set(itemValue, element);
      } else {
        itemsRef.current.delete(itemValue);
      }
      setItemValues(Array.from(itemsRef.current.keys()));
    },
    [],
  );

  return { value, select, registerItem, itemValues };
}
