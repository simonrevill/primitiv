import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { useControllableState } from "../hooks";
import { Slot, composeEventHandlers } from "../Slot";

import {
  ContextMenuContext,
  ContextMenuPosition,
  useContextMenuContext,
} from "./ContextMenuContext";
import {
  ContextMenuRootProps,
  ContextMenuTriggerProps,
} from "./types";

/**
 * The root of a ContextMenu — owns the open state and the position the
 * menu should open at, and provides context to descendants. Renders no
 * DOM of its own; it is a context boundary.
 *
 * Supports two state modes, statically discriminated at the type level so
 * only one shape is accepted by TypeScript:
 *
 * - **Uncontrolled** — pass {@link ContextMenuRootProps.defaultOpen | `defaultOpen`}
 *   (or omit it to start closed). The component owns and updates the open
 *   state internally. Optional {@link ContextMenuRootProps.onOpenChange | `onOpenChange`}
 *   observes transitions.
 * - **Controlled** — pass {@link ContextMenuRootProps.open | `open`} *and*
 *   {@link ContextMenuRootProps.onOpenChange | `onOpenChange`} together. The
 *   parent owns the state; the component defers every transition back through
 *   the callback.
 */
function ContextMenuRoot({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  children,
}: ContextMenuRootProps) {
  const contentId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState<ContextMenuPosition | null>(null);
  const [open, setOpenBase] = useControllableState<boolean>(
    controlledOpen,
    defaultOpen,
    onOpenChange,
  );
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  });

  const setOpen = useCallback(
    (next: boolean) => {
      if (openRef.current === next) return;
      openRef.current = next;
      setOpenBase(next);
    },
    [setOpenBase],
  );

  const contextValue = useMemo(
    () => ({ open, setOpen, position, setPosition, contentId, triggerRef }),
    [open, setOpen, position, contentId],
  );

  return (
    <ContextMenuContext.Provider value={contextValue}>
      {children}
    </ContextMenuContext.Provider>
  );
}

ContextMenuRoot.displayName = "ContextMenuRoot";

/**
 * The area that responds to right-click. Renders a `<span>` by default
 * (a non-button host so the wrapped content keeps its native semantics);
 * pass `asChild` to render any element.
 *
 * When the user opens the platform context menu over this element (via
 * right-click, long-press on touch, or the keyboard context-menu key),
 * the native menu is suppressed and the ContextMenu opens, positioned at
 * the pointer.
 */
function ContextMenuTrigger({
  children,
  onContextMenu,
  asChild = false,
  disabled,
  ...rest
}: ContextMenuTriggerProps) {
  const { setOpen, setPosition, triggerRef } = useContextMenuContext();

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setOpen(true);
  };

  const triggerProps = {
    ...rest,
    ref: triggerRef,
    "data-disabled": disabled ? "" : undefined,
    "data-state": disabled ? undefined : ("closed" as const),
    onContextMenu: composeEventHandlers(onContextMenu, handleContextMenu),
  };

  if (asChild) {
    return <Slot {...triggerProps}>{children}</Slot>;
  }

  return <span {...triggerProps}>{children}</span>;
}

ContextMenuTrigger.displayName = "ContextMenuTrigger";

type TContextMenuCompound = typeof ContextMenuRoot & {
  Root: typeof ContextMenuRoot;
  Trigger: typeof ContextMenuTrigger;
};

const ContextMenuCompound: TContextMenuCompound = Object.assign(
  ContextMenuRoot,
  {
    Root: ContextMenuRoot,
    Trigger: ContextMenuTrigger,
  },
);

ContextMenuCompound.displayName = "ContextMenu";

export { ContextMenuCompound as ContextMenu };
