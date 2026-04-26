import { useId, useMemo } from "react";

import { CollapsibleContext, useCollapsibleContext } from "./CollapsibleContext";

import type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from "./types";

export function CollapsibleRoot({ children, ...rest }: CollapsibleRootProps) {
  const collapsibleId = useId();
  const open = false;

  const contextValue = useMemo(
    () => ({
      open,
      triggerId: `${collapsibleId}-trigger`,
      contentId: `${collapsibleId}-content`,
    }),
    [open, collapsibleId],
  );

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <div data-state={open ? "open" : "closed"} {...rest}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

CollapsibleRoot.displayName = "CollapsibleRoot";

export function CollapsibleTrigger({
  children,
  ...rest
}: CollapsibleTriggerProps) {
  const { open, triggerId, contentId } = useCollapsibleContext();

  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={open}
      aria-controls={contentId}
      data-state={open ? "open" : "closed"}
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
