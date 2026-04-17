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
  const [registeredTriggerItemIds, setRegisteredTriggerItemIds] = useState<string[]>([]);
  const panelsRef = useRef<Set<string>>(new Set());
  const [registeredPanelItemIds, setRegisteredPanelItemIds] = useState<string[]>([]);
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
      } else {
        triggersRef.current.delete(itemId);
      }
      setRegisteredTriggerItemIds(Array.from(triggersRef.current.keys()));
    },
    [],
  );

  const registerPanel = useCallback((itemId: string) => {
    panelsRef.current.add(itemId);
    setRegisteredPanelItemIds(Array.from(panelsRef.current));
  }, []);

  const unregisterPanel = useCallback((itemId: string) => {
    panelsRef.current.delete(itemId);
    setRegisteredPanelItemIds(Array.from(panelsRef.current));
  }, []);

  useEffect(() => {
    for (const triggerId of registeredTriggerItemIds) {
      if (!registeredPanelItemIds.includes(triggerId)) {
        throw new Error(
          `AccordionTrigger (item "${triggerId}") has no corresponding AccordionContent. Every AccordionItem with a Trigger must also contain an AccordionContent.`,
        );
      }
    }
  }, [registeredTriggerItemIds, registeredPanelItemIds]);

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
