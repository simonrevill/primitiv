import { MouseEvent } from "react";

import { CollapsibleContext, useCollapsibleContext } from "./CollapsibleContext";
import { useCollapsibleRoot } from "./hooks";

import type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from "./types";

export function CollapsibleRoot({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  ...rest
}: CollapsibleRootProps) {
  const { contextValue } = useCollapsibleRoot(
    controlledOpen,
    defaultOpen,
    onOpenChange,
    disabled,
  );

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <div
        data-state={contextValue.open ? "open" : "closed"}
        data-disabled={disabled}
        {...rest}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

CollapsibleRoot.displayName = "CollapsibleRoot";

export function CollapsibleTrigger({
  children,
  onClick,
  ...rest
}: CollapsibleTriggerProps) {
  const { open, disabled, toggle, triggerId, contentId } =
    useCollapsibleContext();

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    toggle();
    onClick?.(e);
  }

  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={open}
      aria-controls={contentId}
      aria-disabled={disabled || undefined}
      data-disabled={disabled}
      data-state={open ? "open" : "closed"}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}

CollapsibleTrigger.displayName = "CollapsibleTrigger";

export function CollapsibleContent({
  children,
  ...rest
}: CollapsibleContentProps) {
  const { open, disabled, contentId } = useCollapsibleContext();

  return (
    <div
      id={contentId}
      hidden={!open}
      data-state={open ? "open" : "closed"}
      data-disabled={disabled}
      {...rest}
    >
      {children}
    </div>
  );
}

CollapsibleContent.displayName = "CollapsibleContent";

type CollapsibleCompound = typeof CollapsibleRoot & {
  Root: typeof CollapsibleRoot;
  Trigger: typeof CollapsibleTrigger;
  Content: typeof CollapsibleContent;
};

const CollapsibleCompound: CollapsibleCompound = Object.assign(CollapsibleRoot, {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
});

CollapsibleCompound.displayName = "Collapsible";

export { CollapsibleCompound as Collapsible };
