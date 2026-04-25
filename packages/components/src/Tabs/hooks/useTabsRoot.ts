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

import { useControllableState } from "../../hooks";

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
  // Tabs intentionally does NOT pass onValueChange to useControllableState:
  // in uncontrolled mode the existing public contract fires only `onChange`
  // (with the {index, name} payload), not `onValueChange`. Tabs.Trigger
  // therefore branches on isControlled and calls onValueChange directly in
  // the controlled path; the hook's setter is the uncontrolled-mode setState.
  const [activeValue, setActiveValue, isControlled] =
    useControllableState<string>(value, defaultValue);
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
          setActiveValue(newValue);
        }
      },
    }),
    [isControlled, setActiveValue, onValueChange, triggerValues],
  );

  const contextValue = useMemo(
    () => ({
      orientation,
      dir,
      activationMode,
      tabsId,
      activeValue,
      isControlled,
      setActiveValue,
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
      setActiveValue,
      onValueChange,
      onChange,
      registerTrigger,
      triggerValues,
    ],
  );

  return { contextValue };
}
