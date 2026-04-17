import { useRef, useEffect, MouseEvent, KeyboardEvent } from "react";
import { composeRefs } from "../../Slot";
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

    const enabledTriggers = getTriggers().filter(
      (t) => t.getAttribute("aria-disabled") !== "true",
    );

    const moveNext = (triggers: HTMLButtonElement[]) => {
      const currentIndex = triggers.indexOf(triggerRef.current!);
      const nextIndex = (currentIndex + 1) % triggers.length;
      triggers[nextIndex]?.focus();
    };

    const movePrev = (triggers: HTMLButtonElement[]) => {
      const currentIndex = triggers.indexOf(triggerRef.current!);
      const prevIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      triggers[prevIndex]?.focus();
    };

    const isRtl = orientation === "horizontal" && dir === "rtl";
    const orientationKeys: Record<
      string,
      (triggers: HTMLButtonElement[]) => void
    > =
      orientation === "horizontal"
        ? {
            ArrowRight: isRtl ? movePrev : moveNext,
            ArrowLeft: isRtl ? moveNext : movePrev,
          }
        : { ArrowDown: moveNext, ArrowUp: movePrev };

    const keyHandlers: Record<string, (triggers: HTMLButtonElement[]) => void> =
      {
        ...orientationKeys,
        Home: (triggers) => triggers[0]?.focus(),
        End: (triggers) => triggers[triggers.length - 1]?.focus(),
      };

    const handler = keyHandlers[e.key];
    if (handler) {
      e.preventDefault();
      handler(enabledTriggers);
    }
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
