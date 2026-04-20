import { useCallback, useRef, useState } from "react";

type UseRadioGroupRootArgs = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

type ItemMeta = {
  element: HTMLButtonElement;
  disabled: boolean;
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

  // Track registered item metadata in a ref (for focus handling) and
  // their ordered values as state so re-renders fire when items mount,
  // unmount, or toggle disabled — required for the roving-tabindex
  // home base and for arrow-key skipping.
  const itemsRef = useRef<Map<string, ItemMeta>>(new Map());
  const [itemValues, setItemValues] = useState<string[]>([]);
  const [disabledValues, setDisabledValues] = useState<Set<string>>(
    () => new Set(),
  );

  const registerItem = useCallback(
    (
      itemValue: string,
      element: HTMLButtonElement | null,
      disabled = false,
    ) => {
      if (element) {
        itemsRef.current.set(itemValue, { element, disabled });
      } else {
        itemsRef.current.delete(itemValue);
      }
      setItemValues(Array.from(itemsRef.current.keys()));
      setDisabledValues(
        new Set(
          Array.from(itemsRef.current.entries())
            .filter(([, meta]) => meta.disabled)
            .map(([v]) => v),
        ),
      );
    },
    [],
  );

  const focusItem = useCallback((itemValue: string) => {
    itemsRef.current.get(itemValue)?.element.focus();
  }, []);

  return {
    value,
    select,
    registerItem,
    itemValues,
    disabledValues,
    focusItem,
  };
}
