import { useId, useMemo } from "react";

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
  ...rest
}: DropdownTriggerProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _context = useDropdownContext();
  return (
    <button type="button" {...rest}>
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
