import { useId, useMemo } from "react";

import { composeEventHandlers } from "../Slot";

import { DropdownContext } from "./DropdownContext";
import { useDropdownContext, useDropdownRoot } from "./hooks";
import { DropdownRootProps, DropdownTriggerProps } from "./types";

function DropdownRoot({
  defaultOpen,
  open: controlledOpen,
  onOpenChange,
  children,
}: DropdownRootProps) {
  const { open, setOpen } = useDropdownRoot({
    defaultOpen,
    open: controlledOpen,
    onOpenChange,
  });
  const contentId = useId();
  const contextValue = useMemo(
    () => ({ open, setOpen, contentId }),
    [open, setOpen, contentId],
  );
  return (
    <DropdownContext.Provider value={contextValue}>
      {children}
    </DropdownContext.Provider>
  );
}

DropdownRoot.displayName = "DropdownRoot";

function DropdownTrigger({
  children,
  onClick,
  ...rest
}: DropdownTriggerProps) {
  const { open, setOpen, contentId } = useDropdownContext();
  const toggle = () => setOpen(!open);
  return (
    <button
      type="button"
      {...rest}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={composeEventHandlers(onClick, toggle)}
    >
      {children}
    </button>
  );
}

DropdownTrigger.displayName = "DropdownTrigger";

type TDropdownCompound = typeof DropdownRoot & {
  Root: typeof DropdownRoot;
  Trigger: typeof DropdownTrigger;
};

const DropdownCompound: TDropdownCompound = Object.assign(DropdownRoot, {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
});

DropdownCompound.displayName = "Dropdown";

export { DropdownCompound as Dropdown };
