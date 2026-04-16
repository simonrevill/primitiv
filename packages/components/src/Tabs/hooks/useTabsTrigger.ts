import {
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
  KeyboardEvent,
} from "react";

import { TabsKeyActionsKey, TabsKeyActions, TabsTriggerProps } from "../types";
import { getTriggerAndPanelIds, getKeyToAction } from "../utils";

import { useTabsContext } from "./useTabsContext";

export function useTabsTrigger({
  value,
  onClick,
  disabled,
}: Pick<TabsTriggerProps, "value" | "onClick" | "disabled">) {
  const {
    orientation,
    dir,
    activationMode,
    activeValue,
    isControlled,
    setActiveValue,
    onValueChange,
    onChange,
    tabsId,
    registerTrigger,
    triggersRef,
    triggerValues,
  } = useTabsContext();
  const isActive = activeValue === value;
  const { triggerId, panelId } = getTriggerAndPanelIds(tabsId, value);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const state = isActive ? "active" : "inactive";
  // When no tab is active (no defaultValue/value provided), the first registered
  // trigger acts as the roving-tabindex home base so the tablist stays reachable
  // via keyboard Tab navigation.
  const isFirst = triggerValues[0] === value;
  const tabIndex = isActive || (activeValue === undefined && isFirst) ? 0 : -1;

  useEffect(() => {
    registerTrigger(value, buttonRef.current);
    return () => registerTrigger(value, null);
  }, [value, registerTrigger]);

  const activateTab = useCallback(
    (newValue: string, index: number) => {
      if (activeValue === newValue) return;
      if (isControlled) {
        onValueChange?.(newValue);
      } else {
        setActiveValue(newValue);
      }
      onChange?.({ index, name: newValue });
    },
    [activeValue, isControlled, onValueChange, setActiveValue, onChange],
  );

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const index = triggerValues.indexOf(value);
    if (!disabled) {
      activateTab(value, index);
    }
    onClick?.(e);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = triggerValues.indexOf(value);
    const totalTabs = triggerValues.length;
    const keyToAction = getKeyToAction(orientation, dir);
    const action = keyToAction[e.key as TabsKeyActionsKey];

    function activateIfEnabled(
      targetIndex: number,
      key?: keyof TabsKeyActions,
    ) {
      const targetValue = triggerValues[targetIndex];
      const targetElement = triggersRef.current.get(targetValue);
      const isDisabled =
        targetElement?.getAttribute("aria-disabled") === "true";
      if (
        !isDisabled &&
        (activationMode === "automatic" ||
          (activationMode === "manual" && key === "enter"))
      ) {
        activateTab(targetValue, targetIndex);
      }
      targetElement?.focus();
    }

    const actions: TabsKeyActions = {
      moveForward: () => activateIfEnabled((currentIndex + 1) % totalTabs),
      moveBackward: () =>
        activateIfEnabled((currentIndex - 1 + totalTabs) % totalTabs),
      home: () => activateIfEnabled(0),
      end: () => activateIfEnabled(totalTabs - 1),
      enter: () => activateIfEnabled(currentIndex, "enter"),
    };

    if (action && actions[action]) {
      e.preventDefault();
      actions[action]();
    }
  }
  return {
    buttonRef,
    triggerId,
    panelId,
    isActive,
    orientation,
    state,
    tabIndex,
    handleClick,
    handleKeyDown,
  };
}
