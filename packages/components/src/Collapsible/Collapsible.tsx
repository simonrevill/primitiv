import { Ref } from "react";

import { Slot } from "../Slot";

import { CollapsibleContext, useCollapsibleContext } from "./CollapsibleContext";
import { useCollapsibleRoot, useCollapsibleTrigger } from "./hooks";

import type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
  CollapsibleTriggerIconProps,
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

export function CollapsibleTrigger<
  T extends HTMLElement = HTMLButtonElement,
>({
  ref,
  children,
  onClick,
  onKeyDown,
  asChild = false,
  ...rest
}: CollapsibleTriggerProps<T>) {
  const { triggerProps } = useCollapsibleTrigger({
    ref: ref as Ref<HTMLButtonElement>,
    onClick,
    onKeyDown,
    asChild,
    ...rest,
  });

  if (asChild) {
    return <Slot {...triggerProps}>{children}</Slot>;
  }

  return (
    <button type="button" {...triggerProps}>
      {children}
    </button>
  );
}

CollapsibleTrigger.displayName = "CollapsibleTrigger";

export function CollapsibleContent({
  children,
  forceMount = false,
  ...rest
}: CollapsibleContentProps) {
  const { open, disabled, contentId } = useCollapsibleContext();

  return (
    <div
      id={contentId}
      hidden={forceMount ? undefined : !open}
      aria-hidden={forceMount && !open ? true : undefined}
      data-state={open ? "open" : "closed"}
      data-disabled={disabled}
      {...rest}
    >
      {children}
    </div>
  );
}

CollapsibleContent.displayName = "CollapsibleContent";

export function CollapsibleTriggerIcon({
  children,
  ...rest
}: CollapsibleTriggerIconProps) {
  const { open } = useCollapsibleContext();

  return (
    <span
      aria-hidden="true"
      data-state={open ? "open" : "closed"}
      {...rest}
    >
      {children}
    </span>
  );
}

CollapsibleTriggerIcon.displayName = "CollapsibleTriggerIcon";

type CollapsibleCompound = typeof CollapsibleRoot & {
  Root: typeof CollapsibleRoot;
  Trigger: typeof CollapsibleTrigger;
  Content: typeof CollapsibleContent;
  TriggerIcon: typeof CollapsibleTriggerIcon;
};

const CollapsibleCompound: CollapsibleCompound = Object.assign(CollapsibleRoot, {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
  TriggerIcon: CollapsibleTriggerIcon,
});

CollapsibleCompound.displayName = "Collapsible";

export { CollapsibleCompound as Collapsible };
