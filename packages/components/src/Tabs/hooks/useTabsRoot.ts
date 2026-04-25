import {
  useId,
  useEffect,
  useImperativeHandle,
  useMemo,
  Ref,
} from "react";

import { useCollection, useControllableState } from "../../hooks";

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
  const {
    register: registerTrigger,
    itemsRef: triggersRef,
    keys: triggerValues,
  } = useCollection<string, HTMLButtonElement>();

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
