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
  ...rest
}: CollapsibleRootProps) {
  const { contextValue } = useCollapsibleRoot(
    controlledOpen,
    defaultOpen,
    onOpenChange,
  );

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <div data-state={contextValue.open ? "open" : "closed"} {...rest}>
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
  const { open, toggle, triggerId, contentId } = useCollapsibleContext();

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    toggle();
    onClick?.(e);
  }

  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={open}
      aria-controls={contentId}
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
  const { open, contentId } = useCollapsibleContext();

  return (
    <div
      id={contentId}
      hidden={!open}
      data-state={open ? "open" : "closed"}
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
