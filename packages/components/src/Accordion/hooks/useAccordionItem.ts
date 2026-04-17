import { useId, useMemo } from "react";
import { useAccordionContext } from "./useAccordionContext";

export function useAccordionItem(value: string | undefined) {
  const { accordionId, expandedItems } = useAccordionContext();
  // Use provided value prop, or fall back to React's useId for stable IDs
  const autoId = useId();
  const itemId = value ?? autoId;
  const buttonId = `${accordionId}-heading-${itemId}`;
  const panelId = `${accordionId}-panel-${itemId}`;
  const isExpanded = expandedItems.has(itemId);

  const contextValue = useMemo(
    () => ({ buttonId, panelId, itemId, isExpanded }),
    [buttonId, panelId, itemId, isExpanded],
  );

  return { contextValue };
}
