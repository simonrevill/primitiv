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
    activationMode = "automatic",
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
  // Tracks the ordered list of registered trigger values as state so that
  // consumers can re-render when triggers mount/unmount (e.g. to compute
  // the roving-tabindex home base when no active value is set).
  const [triggerValues, setTriggerValues] = useState<string[]>([]);

  useEffect(() => {
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
  }, [activeValue, triggerValues]);

  const registerTrigger = useCallback(
    (triggerValue: string, element: HTMLButtonElement | null) => {
      if (element) {
        triggersRef.current.set(triggerValue, element);
      } else {
        triggersRef.current.delete(triggerValue);
      }
      setTriggerValues(Array.from(triggersRef.current.keys()));
    },
    [],
  );

  // Imperative API
  useImperativeHandle(
    ref,
    () => ({
      setActiveTab: (newValue: string) => {
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
    [isControlled, onValueChange, triggerValues],
  );

  const contextValue = useMemo(
    () => ({
      orientation,
      dir,
      activationMode,
      tabsId,
      activeValue,
      isControlled,
      setActiveValue: setInternalValue,
      onValueChange,
      onChange,
      registerTrigger,
      triggersRef,
      triggerValues,
    }),
    [
      orientation,
      dir,
      activationMode,
      tabsId,
      activeValue,
      isControlled,
      onValueChange,
      onChange,
      registerTrigger,
      triggerValues,
    ],
  );

  return { contextValue };
}
