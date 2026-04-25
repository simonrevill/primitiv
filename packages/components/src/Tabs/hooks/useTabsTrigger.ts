import {
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
  KeyboardEvent,
} from "react";

import { getKeyToActionMap, type RovingKeyAction } from "../../utils";

import { TabsTriggerProps } from "../types";
import { getTriggerAndPanelIds } from "../utils";

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
    triggerValues,
    disabledTriggerValues,
    focusTrigger,
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
    registerTrigger(value, buttonRef.current, disabled);
    return () => registerTrigger(value, null);
  }, [value, disabled, registerTrigger]);

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

  // Note: this composition is deliberately bespoke and does NOT use the
  // shared composeEventHandlers from ../../Slot. It runs the library's
  // activation BEFORE the consumer's onClick, and offers no preventDefault
  // veto path — both differ from the shared util's contract. Switching to
  // composeEventHandlers here would be an observable behaviour change for
  // consumers (handler ordering and preventDefault semantics).
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
    const action = getKeyToActionMap({
      orientation,
      dir,
      homeEnd: true,
      activate: true,
    })[e.key];

    function activateIfEnabled(
      targetIndex: number,
      sourceAction?: RovingKeyAction,
    ) {
      const targetValue = triggerValues[targetIndex];
      const isDisabled = disabledTriggerValues.has(targetValue);
      if (
        !isDisabled &&
        (activationMode === "automatic" ||
          (activationMode === "manual" && sourceAction === "activate"))
      ) {
        activateTab(targetValue, targetIndex);
      }
      focusTrigger(targetValue);
    }

    const actions: Record<RovingKeyAction, () => void> = {
      next: () => activateIfEnabled((currentIndex + 1) % totalTabs),
      prev: () => activateIfEnabled((currentIndex - 1 + totalTabs) % totalTabs),
      first: () => activateIfEnabled(0),
      last: () => activateIfEnabled(totalTabs - 1),
      activate: () => activateIfEnabled(currentIndex, "activate"),
    };

    if (action) {
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
