import { useEffect, useId, useMemo, useRef } from "react";

import { composeEventHandlers } from "../Slot";

import { DropdownContext } from "./DropdownContext";
import { useDropdownContext, useDropdownRoot } from "./hooks";
import {
  DropdownContentProps,
  DropdownItemProps,
  DropdownRootProps,
  DropdownTriggerProps,
} from "./types";

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

function DropdownContent({ children, ...rest }: DropdownContentProps) {
  const { open, contentId } = useDropdownContext();
  const menuRef = useRef<HTMLMenuElement | null>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (open) {
      menu.showPopover();
      const firstItem = menu.querySelector<HTMLElement>(
        '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
      );
      firstItem?.focus();
    } else {
      menu.hidePopover();
    }
  }, [open]);

  return (
    <menu
      {...rest}
      ref={menuRef}
      id={contentId}
      role="menu"
      popover="auto"
    >
      {children}
    </menu>
  );
}

DropdownContent.displayName = "DropdownContent";

function DropdownItem({
  children,
  onClick,
  onSelect,
  ...rest
}: DropdownItemProps) {
  const { setOpen } = useDropdownContext();
  const handleClick = () => {
    const event = new Event("dropdown.select", { cancelable: true });
    onSelect?.(event);
    if (!event.defaultPrevented) setOpen(false);
  };
  return (
    <li
      {...rest}
      role="menuitem"
      tabIndex={-1}
      onClick={composeEventHandlers(onClick, handleClick)}
    >
      {children}
    </li>
  );
}

DropdownItem.displayName = "DropdownItem";

type TDropdownCompound = typeof DropdownRoot & {
  Root: typeof DropdownRoot;
  Trigger: typeof DropdownTrigger;
  Content: typeof DropdownContent;
  Item: typeof DropdownItem;
};

const DropdownCompound: TDropdownCompound = Object.assign(DropdownRoot, {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
});

DropdownCompound.displayName = "Dropdown";

export { DropdownCompound as Dropdown };
