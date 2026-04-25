import { useRef, useEffect, MouseEvent, KeyboardEvent } from "react";

import { composeRefs } from "../../Slot";
import { getKeyToActionMap, type RovingKeyAction } from "../../utils";

import { AccordionTriggerProps } from "../types";

import { useAccordionContext } from "./useAccordionContext";
import { useAccordionItemContext } from "./useAccordionItemContext";

export function useAccordionTrigger({
  ref,
  onClick,
  disabled,
  asChild = false,
  ...rest
}: Omit<AccordionTriggerProps, "children">) {
  const { buttonId, panelId, itemId, isExpanded } = useAccordionItemContext();
  const { toggleItem, registerTrigger, getTriggers, orientation, dir } =
    useAccordionContext();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const composedRef = ref ? composeRefs(triggerRef, ref) : triggerRef;

  // Register/unregister this trigger with the context
  useEffect(() => {
    registerTrigger(itemId, triggerRef.current);
    return () => registerTrigger(itemId, null);
  }, [itemId, registerTrigger]);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    toggleItem(itemId);
    onClick?.(e);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      toggleItem(itemId);
      return;
    }

    const action = getKeyToActionMap({ orientation, dir, homeEnd: true })[
      e.key
    ];
    if (!action) return;

    const enabledTriggers = getTriggers().filter(
      (t) => t.getAttribute("aria-disabled") !== "true",
    );
    if (enabledTriggers.length === 0) return;

    e.preventDefault();
    const currentIndex = enabledTriggers.indexOf(triggerRef.current!);
    const handlers: Partial<Record<RovingKeyAction, () => void>> = {
      next: () =>
        enabledTriggers[
          (currentIndex + 1) % enabledTriggers.length
        ]?.focus(),
      prev: () =>
        enabledTriggers[
          (currentIndex - 1 + enabledTriggers.length) % enabledTriggers.length
        ]?.focus(),
      first: () => enabledTriggers[0]?.focus(),
      last: () => enabledTriggers[enabledTriggers.length - 1]?.focus(),
    };
    handlers[action]?.();
  }

  const triggerProps = {
    ref: composedRef,
    "aria-expanded": isExpanded,
    id: buttonId,
    "aria-controls": panelId,
    "aria-disabled": disabled,
    "data-disabled": disabled,
    ...(asChild && disabled ? { role: "button" } : {}),
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    "data-state": isExpanded ? "open" : "closed",
    ...rest,
  };

  return { triggerProps };
}
