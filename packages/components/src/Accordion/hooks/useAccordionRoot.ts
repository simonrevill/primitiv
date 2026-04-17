import { useRef, useMemo, useCallback, useState, useId, useEffect } from "react";
import type { AccordionReadingDirection } from "../types";

export function useAccordionRoot(
  controlledValue: string[] | undefined,
  defaultValue: string | (readonly string[] & string) | undefined,
  multiple: boolean,
  onValueChange: ((values: string[]) => void) | undefined,
  orientation: "vertical" | "horizontal",
  dir: AccordionReadingDirection,
) {
  const accordionId = useId();
  const triggersRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  // State so validation re-runs when a trigger mounts. Only updated on mount,
  // not on cleanup, to avoid setState calls outside act() in tests.
  const [registeredTriggerItemIds, setRegisteredTriggerItemIds] = useState<string[]>([]);
  const panelsRef = useRef<Set<string>>(new Set());
  const isControlled = controlledValue !== undefined;

  const [internalExpandedItems, setInternalExpandedItems] = useState<
    Set<string>
  >(() => {
    if (defaultValue !== undefined) {
      return new Set([defaultValue]);
    }
    return new Set();
  });

  const expandedItems = isControlled
    ? new Set(controlledValue)
    : internalExpandedItems;

  const computeNext = (prev: Set<string>, itemId: string): Set<string> => {
    const next = new Set(prev);
    if (next.has(itemId)) {
      next.delete(itemId);
    } else if (multiple) {
      next.add(itemId);
    } else {
      next.clear();
      next.add(itemId);
    }
    return next;
  };

  const toggleItem = useCallback(
    (itemId: string) => {
      if (isControlled) {
        const next = computeNext(new Set(controlledValue), itemId);
        onValueChange?.(Array.from(next));
      } else {
        setInternalExpandedItems((prev) => computeNext(prev, itemId));
      }
    },
    [isControlled, multiple, controlledValue, onValueChange],
  );

  const registerTrigger = useCallback(
    (itemId: string, element: HTMLButtonElement | null) => {
      if (element) {
        triggersRef.current.set(itemId, element);
        setRegisteredTriggerItemIds(Array.from(triggersRef.current.keys()));
      } else {
        // Cleanup only — update the ref but not state, so no setState fires
        // outside act() when components unmount after a validation throw.
        triggersRef.current.delete(itemId);
      }
    },
    [],
  );

  // Panels are tracked in a ref only. registerPanel does NOT call setState —
  // the validation effect reads panelsRef.current directly. Because React 18
  // runs all effects in a commit before flushing batched state updates, the
  // panel effect always executes (and updates panelsRef) before the re-render
  // triggered by setRegisteredTriggerItemIds reaches the validation effect.
  const registerPanel = useCallback((itemId: string) => {
    panelsRef.current.add(itemId);
  }, []);

  const unregisterPanel = useCallback((itemId: string) => {
    panelsRef.current.delete(itemId);
  }, []);

  useEffect(() => {
    for (const triggerId of registeredTriggerItemIds) {
      if (!panelsRef.current.has(triggerId)) {
        throw new Error(
          `AccordionTrigger (item "${triggerId}") has no corresponding AccordionContent. Every AccordionItem with a Trigger must also contain an AccordionContent.`,
        );
      }
    }
  }, [registeredTriggerItemIds]);

  const getTriggers = useCallback(() => {
    return Array.from(triggersRef.current.values());
  }, []);

  const contextValue = useMemo(
    () => ({
      accordionId,
      expandedItems,
      orientation,
      dir,
      toggleItem,
      registerTrigger,
      getTriggers,
      registerPanel,
      unregisterPanel,
    }),
    [
      accordionId,
      expandedItems,
      orientation,
      dir,
      toggleItem,
      registerTrigger,
      getTriggers,
      registerPanel,
      unregisterPanel,
    ],
  );

  return { contextValue };
}
