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
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contextValue = useMemo(
    () => ({ open, setOpen, contentId, triggerRef }),
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
  const { open, setOpen, contentId, triggerRef } = useDropdownContext();
  const toggle = () => setOpen(!open);
  return (
    <button
      type="button"
      {...rest}
      ref={triggerRef}
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

const MENUITEM_SELECTOR =
  '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

const TYPEAHEAD_RESET_MS = 500;

function DropdownContent({
  children,
  onKeyDown,
  ...rest
}: DropdownContentProps) {
  const { open, setOpen, contentId, triggerRef } = useDropdownContext();
  const menuRef = useRef<HTMLMenuElement | null>(null);
  const typeaheadRef = useRef<{ query: string; timer: number | null }>({
    query: "",
    timer: null,
  });

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (open) {
      menu.showPopover();
      const firstItem = menu.querySelector<HTMLElement>(MENUITEM_SELECTOR);
      firstItem?.focus();
    } else {
      menu.hidePopover();
    }
  }, [open]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLMenuElement>) => {
    const menu = menuRef.current;
    if (!menu) return;
    const items = Array.from(
      menu.querySelectorAll<HTMLElement>(MENUITEM_SELECTOR),
    );
    if (items.length === 0) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") {
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      nextIndex =
        currentIndex < 0
          ? items.length - 1
          : (currentIndex - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      items[nextIndex].focus();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      if (currentIndex < 0) return;
      event.preventDefault();
      items[currentIndex].click();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.key.length === 1 && event.key !== " ") {
      const state = typeaheadRef.current;
      if (state.timer !== null) window.clearTimeout(state.timer);
      state.query = (state.query + event.key).toLowerCase();
      state.timer = window.setTimeout(() => {
        state.query = "";
        state.timer = null;
      }, TYPEAHEAD_RESET_MS);

      const isRepeat =
        state.query.length > 1 &&
        state.query.split("").every((c) => c === state.query[0]);
      const searchQuery = isRepeat ? state.query[0] : state.query;
      const startIndex = currentIndex < 0 ? 0 : currentIndex;
      const offset = searchQuery.length === 1 || isRepeat ? 1 : 0;
      for (let i = 0; i < items.length; i++) {
        const index = (startIndex + offset + i) % items.length;
        const text = (items[index].textContent ?? "").trim().toLowerCase();
        if (text.startsWith(searchQuery)) {
          event.preventDefault();
          items[index].focus();
          return;
        }
      }
    }
  };

  return (
    <menu
      {...rest}
      ref={menuRef}
      id={contentId}
      role="menu"
      popover="auto"
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
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
  const { setOpen, triggerRef } = useDropdownContext();
  const handleClick = () => {
    const event = new Event("dropdown.select", { cancelable: true });
    onSelect?.(event);
    if (!event.defaultPrevented) {
      setOpen(false);
      triggerRef.current?.focus();
    }
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
