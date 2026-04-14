import {
  useId,
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  useMemo,
  Ref,
} from "react";

import type { TabsRootProps, TabsImperativeApi } from "../types";

export function useTabsRoot(
  {
    orientation = "horizontal",
    dir = "ltr",
    defaultValue,
    value,
    onValueChange,
    onChange,
  }: Omit<TabsRootProps, "className">,
  ref: Ref<TabsImperativeApi>,
) {
  const tabsId = useId();
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = isControlled ? value : internalValue;
  const triggersRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const triggerValues = Array.from(triggersRef.current.keys());
    if (
      triggerValues.length > 0 &&
      activeValue !== undefined &&
      !triggerValues.includes(activeValue)
    ) {
      throw new Error(
        `Invalid active tab value: "${activeValue}". Valid values are: [${triggerValues.join(
          ", ",
        )}]`,
      );
    }
  }, [activeValue, triggersRef, triggersRef.current.size]);

  const registerTrigger = useCallback(
    (triggerValue: string, element: HTMLButtonElement | null) => {
      if (element) {
        triggersRef.current.set(triggerValue, element);
      } else {
        triggersRef.current.delete(triggerValue);
      }
    },
    [],
  );

  // Imperative API
  useImperativeHandle(
    ref,
    () => ({
      setActiveTab: (newValue: string) => {
        const triggerValues = Array.from(triggersRef.current.keys());
        if (!triggerValues.includes(newValue)) {
          throw new Error(`Invalid tab value: ${newValue}`);
        }

        if (isControlled) {
          onValueChange?.(newValue);
        } else {
          setInternalValue(newValue);
        }
      },
    }),
    [isControlled, onValueChange],
  );

  const contextValue = useMemo(
    () => ({
      orientation,
      dir,
      tabsId,
      activeValue,
      isControlled,
      setActiveValue: setInternalValue,
      onValueChange,
      onChange,
      registerTrigger,
      triggersRef,
    }),
    [
      orientation,
      dir,
      tabsId,
      activeValue,
      isControlled,
      onValueChange,
      onChange,
      registerTrigger,
    ],
  );

  return { contextValue };
}
