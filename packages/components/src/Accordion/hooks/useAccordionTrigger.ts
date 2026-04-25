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
  const {
    toggleItem,
    registerTrigger,
    registeredTriggerItemIds,
    disabledItemIds,
    focusTrigger,
    orientation,
    dir,
  } = useAccordionContext();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const composedRef = ref ? composeRefs(triggerRef, ref) : triggerRef;

  // Register/unregister this trigger with the context. The disabled flag
  // is now tracked in registration metadata (via useCollection's value
  // type) instead of being read from the rendered aria-disabled attribute,
  // which keeps Accordion consistent with RadioGroup and is the model
  // useRovingTabindex expects.
  useEffect(() => {
    registerTrigger(itemId, triggerRef.current, disabled);
    return () => registerTrigger(itemId, null);
  }, [itemId, disabled, registerTrigger]);

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

    const enabledItemIds = registeredTriggerItemIds.filter(
      (id) => !disabledItemIds.has(id),
    );
    if (enabledItemIds.length === 0) return;

    e.preventDefault();
    const currentIndex = enabledItemIds.indexOf(itemId);
    const handlers: Partial<Record<RovingKeyAction, () => void>> = {
      next: () =>
        focusTrigger(
          enabledItemIds[(currentIndex + 1) % enabledItemIds.length],
        ),
      prev: () =>
        focusTrigger(
          enabledItemIds[
            (currentIndex - 1 + enabledItemIds.length) % enabledItemIds.length
          ],
        ),
      first: () => focusTrigger(enabledItemIds[0]),
      last: () => focusTrigger(enabledItemIds[enabledItemIds.length - 1]),
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
