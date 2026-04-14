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
}: Pick<TabsTriggerProps, "value" | "onClick">) {
  const {
    orientation,
    dir,
    activeValue,
    isControlled,
    setActiveValue,
    onValueChange,
    onChange,
    tabsId,
    registerTrigger,
    triggersRef,
  } = useTabsContext();
  const isActive = activeValue === value;
  const { triggerId, panelId } = getTriggerAndPanelIds(tabsId, value);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const state = isActive ? "active" : "inactive";
  const tabIndex = isActive ? 0 : -1;

  useEffect(() => {
    registerTrigger(value, buttonRef.current);
    return () => registerTrigger(value, null);
  }, [value, registerTrigger]);

  const activateTab = useCallback(
    (newValue: string, index: number) => {
      const wasAlreadyActive = activeValue === newValue;
      if (isControlled) {
        onValueChange?.(newValue);
      } else {
        setActiveValue(newValue);
      }
      if (!wasAlreadyActive) {
        onChange?.({ index, name: newValue });
      }
    },
    [activeValue, isControlled, onValueChange, setActiveValue, onChange],
  );

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const index = Array.from(triggersRef.current.keys()).indexOf(value);
    activateTab(value, index);
    onClick?.(e);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const triggerValues = Array.from(triggersRef.current.keys());
    const currentIndex = triggerValues.indexOf(value);
    const totalTabs = triggerValues.length;
    const keyToAction = getKeyToAction(orientation, dir);
    const action = keyToAction[e.key as TabsKeyActionsKey];

    const actions: TabsKeyActions = {
      moveForward: () => {
        const nextIndex = (currentIndex + 1) % totalTabs;
        const nextValue = triggerValues[nextIndex];
        const nextElement = triggersRef.current.get(nextValue);
        activateTab(nextValue, nextIndex);
        nextElement?.focus();
      },
      moveBackward: () => {
        const prevIndex = (currentIndex - 1 + totalTabs) % totalTabs;
        const prevValue = triggerValues[prevIndex];
        const prevElement = triggersRef.current.get(prevValue);
        activateTab(prevValue, prevIndex);
        prevElement?.focus();
      },
      home: () => {
        const firstValue = triggerValues[0];
        const firstElement = triggersRef.current.get(firstValue);
        activateTab(firstValue, 0);
        firstElement?.focus();
      },
      end: () => {
        const lastValue = triggerValues[totalTabs - 1];
        const lastElement = triggersRef.current.get(lastValue);
        activateTab(lastValue, totalTabs - 1);
        lastElement?.focus();
      },
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
