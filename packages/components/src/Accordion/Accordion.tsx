import {
  useRef,
  useMemo,
  useCallback,
  useState,
  useId,
  cloneElement,
  useEffect,
  HTMLAttributes,
  MouseEvent,
  KeyboardEvent,
  Ref,
} from "react";

import { Slot, composeRefs } from "../Slot";

import type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionHeaderProps,
  AccordionContentProps,
  AccordionTriggerIconProps,
} from "./types";

import type { HeadingTag } from "../types";

import { AccordionContext, AccordionItemContext } from "./AccordionContext";
import {
  useAccordionContext,
  useAccordionHeaderContext,
  useAccordionItemContext,
} from "./hooks";

export function AccordionRoot({
  children,
  multiple = false,
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = "vertical",
  dir = "ltr",
  ...rest
}: AccordionRootProps) {
  const accordionId = useId();
  const triggersRef = useRef<Map<string, HTMLButtonElement>>(new Map());
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isControlled, multiple, controlledValue, onValueChange],
  );

  const registerTrigger = useCallback(
    (itemId: string, element: HTMLButtonElement | null) => {
      if (element) {
        triggersRef.current.set(itemId, element);
      } else {
        triggersRef.current.delete(itemId);
      }
    },
    [],
  );

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
    }),
    [accordionId, expandedItems, orientation, dir, toggleItem, registerTrigger, getTriggers],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div data-orientation={orientation} dir={dir} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

AccordionRoot.displayName = "AccordionRoot";
export function AccordionItem({
  children,
  value,
  ...rest
}: AccordionItemProps) {
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

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div {...rest}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

AccordionItem.displayName = "AccordionItem";

export function AccordionHeader({
  children,
  level = 3,
  ...rest
}: AccordionHeaderProps) {
  useAccordionHeaderContext();
  const HeadingTag: HeadingTag = `h${level}`;

  return <HeadingTag {...rest}>{children}</HeadingTag>;
}

AccordionHeader.displayName = "AccordionHeader";

export function AccordionTrigger({
  ref: externalRef,
  children,
  onClick,
  disabled = false,
  asChild = false,
  ...rest
}: AccordionTriggerProps & { ref?: Ref<HTMLButtonElement> }) {
  const { buttonId, panelId, itemId, isExpanded } = useAccordionItemContext();
  const { toggleItem, registerTrigger, getTriggers, orientation, dir } =
    useAccordionContext();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const composedRef = externalRef
    ? composeRefs(triggerRef, externalRef)
    : triggerRef;

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
    const enabledTriggers = getTriggers().filter(
      (t) => t.getAttribute("aria-disabled") !== "true",
    );

    const moveNext = (triggers: HTMLButtonElement[]) => {
      if (triggerRef.current) {
        const currentIndex = triggers.indexOf(triggerRef.current);
        const nextIndex = (currentIndex + 1) % triggers.length;
        triggers[nextIndex]?.focus();
      }
    };

    const movePrev = (triggers: HTMLButtonElement[]) => {
      if (triggerRef.current) {
        const currentIndex = triggers.indexOf(triggerRef.current);
        const prevIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        triggers[prevIndex]?.focus();
      }
    };

    const isRtl = orientation === "horizontal" && dir === "rtl";
    const orientationKeys =
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
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    "data-state": isExpanded ? "open" : "closed",
    ...rest,
  };

  if (asChild) {
    return <Slot {...triggerProps}>{children}</Slot>;
  }

  return (
    <button type="button" {...triggerProps}>
      {children}
    </button>
  );
}

AccordionTrigger.displayName = "AccordionTrigger";

export function AccordionContent({
  children,
  forceMount = false,
  ...rest
}: AccordionContentProps) {
  const { panelId, buttonId, isExpanded } = useAccordionItemContext();

  return (
    <div
      id={panelId}
      aria-labelledby={buttonId}
      role="region"
      hidden={forceMount ? undefined : !isExpanded}
      data-state={isExpanded ? "open" : "closed"}
      {...rest}
    >
      {children}
    </div>
  );
}

AccordionContent.displayName = "AccordionContent";

export function AccordionTriggerIcon({ icon }: AccordionTriggerIconProps) {
  const { isExpanded } = useAccordionItemContext();
  return cloneElement(icon, {
    "aria-hidden": "true",
    "data-state": isExpanded ? "open" : "closed",
  } as Partial<HTMLAttributes<HTMLElement>>);
}

AccordionTriggerIcon.displayName = "AccordionTriggerIcon";

type AccordionCompound = typeof AccordionRoot & {
  Root: typeof AccordionRoot;
  Item: typeof AccordionItem;
  Header: typeof AccordionHeader;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
  TriggerIcon: typeof AccordionTriggerIcon;
};

const AccordionCompound: AccordionCompound = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
  TriggerIcon: AccordionTriggerIcon,
});

AccordionCompound.displayName = "Accordion";

export { AccordionCompound as Accordion };
