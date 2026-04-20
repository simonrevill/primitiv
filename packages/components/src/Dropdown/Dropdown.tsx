import { useContext, useEffect, useId, useMemo, useRef } from "react";

import { useCheckboxRoot } from "../Checkbox/hooks";
import { useRadioGroupRoot } from "../RadioGroup/hooks";
import { composeEventHandlers, Slot } from "../Slot";

import { DropdownContext } from "./DropdownContext";
import { DropdownGroupContext } from "./DropdownGroupContext";
import { DropdownRadioGroupContext } from "./DropdownRadioGroupContext";
import { DropdownSubContext } from "./DropdownSubContext";
import { useDropdownContext, useDropdownRoot } from "./hooks";
import {
  DropdownCheckboxItemProps,
  DropdownContentProps,
  DropdownGroupProps,
  DropdownItemProps,
  DropdownLabelProps,
  DropdownRadioGroupProps,
  DropdownRadioItemProps,
  DropdownRootProps,
  DropdownSeparatorProps,
  DropdownSubContentProps,
  DropdownSubProps,
  DropdownSubTriggerProps,
  DropdownTriggerProps,
} from "./types";

function useDropdownSubContext() {
  const context = useContext(DropdownSubContext);
  if (!context) {
    throw new Error(
      "Dropdown.SubTrigger and Dropdown.SubContent must be rendered inside a <Dropdown.Sub>.",
    );
  }
  return context;
}

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
  asChild = false,
  ...rest
}: DropdownTriggerProps) {
  const { open, setOpen, contentId, triggerRef } = useDropdownContext();
  const toggle = () => setOpen(!open);
  const triggerProps = {
    ...rest,
    ref: triggerRef,
    "aria-haspopup": "menu" as const,
    "aria-expanded": open,
    "aria-controls": contentId,
    onClick: composeEventHandlers(onClick, toggle),
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

DropdownTrigger.displayName = "DropdownTrigger";

const MENUITEM_SELECTOR =
  '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemcheckbox"]:not([aria-disabled="true"]), [role="menuitemradio"]:not([aria-disabled="true"])';

const TYPEAHEAD_RESET_MS = 500;

function DropdownContent({
  children,
  onKeyDown,
  asChild = false,
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
      if (!menu.contains(document.activeElement)) {
        const firstItem = menu.querySelector<HTMLElement>(MENUITEM_SELECTOR);
        firstItem?.focus();
      }
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
      state.query = (state.query + event.key).toLowerCase();

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

  const contentProps = {
    ...rest,
    ref: menuRef,
    id: contentId,
    role: "menu" as const,
    popover: "auto" as const,
    onKeyDown: composeEventHandlers(onKeyDown, handleKeyDown),
  };
  if (asChild) {
    return <Slot {...contentProps}>{children}</Slot>;
  }
  return <menu {...contentProps}>{children}</menu>;
}

DropdownContent.displayName = "DropdownContent";

function DropdownItem({
  children,
  onClick,
  onSelect,
  disabled,
  asChild = false,
  ...rest
}: DropdownItemProps) {
  const { setOpen, triggerRef } = useDropdownContext();
  const handleClick = () => {
    if (disabled) return;
    const event = new Event("dropdown.select", { cancelable: true });
    onSelect?.(event);
    if (!event.defaultPrevented) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };
  const itemProps = {
    ...rest,
    role: "menuitem" as const,
    tabIndex: -1,
    "aria-disabled": disabled || undefined,
    onClick: composeEventHandlers(onClick, handleClick),
  };
  if (asChild) {
    return <Slot {...itemProps}>{children}</Slot>;
  }
  return <li {...itemProps}>{children}</li>;
}

DropdownItem.displayName = "DropdownItem";

function DropdownSeparator({
  asChild = false,
  children,
  ...rest
}: DropdownSeparatorProps) {
  const separatorProps = { ...rest, role: "separator" as const };
  if (asChild) {
    return <Slot {...separatorProps}>{children}</Slot>;
  }
  return <li {...separatorProps} />;
}

DropdownSeparator.displayName = "DropdownSeparator";

function DropdownGroup({
  children,
  asChild = false,
  ...rest
}: DropdownGroupProps) {
  const labelId = useId();
  const contextValue = useMemo(() => ({ labelId }), [labelId]);
  const groupProps = {
    ...rest,
    role: "group" as const,
    "aria-labelledby": labelId,
  };
  return (
    <DropdownGroupContext.Provider value={contextValue}>
      {asChild ? (
        <Slot {...groupProps}>{children}</Slot>
      ) : (
        <li {...groupProps}>
          <ul role="none">{children}</ul>
        </li>
      )}
    </DropdownGroupContext.Provider>
  );
}

DropdownGroup.displayName = "DropdownGroup";

function DropdownLabel({
  id,
  children,
  asChild = false,
  ...rest
}: DropdownLabelProps) {
  const group = useContext(DropdownGroupContext);
  const labelProps = { ...rest, id: id ?? group?.labelId };
  if (asChild) {
    return <Slot {...labelProps}>{children}</Slot>;
  }
  return <li {...labelProps}>{children}</li>;
}

DropdownLabel.displayName = "DropdownLabel";

function DropdownCheckboxItem({
  children,
  onClick,
  onSelect,
  disabled,
  defaultChecked,
  checked: controlledChecked,
  onCheckedChange,
  asChild = false,
  ...rest
}: DropdownCheckboxItemProps) {
  const { setOpen, triggerRef } = useDropdownContext();
  const { checked, toggle } = useCheckboxRoot({
    defaultChecked,
    checked: controlledChecked,
    onCheckedChange,
  });
  const ariaChecked =
    checked === "indeterminate" ? "mixed" : checked ? "true" : "false";
  const handleClick = () => {
    if (disabled) return;
    toggle();
    const event = new Event("dropdown.select", { cancelable: true });
    onSelect?.(event);
    if (!event.defaultPrevented) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };
  const itemProps = {
    ...rest,
    role: "menuitemcheckbox" as const,
    tabIndex: -1,
    "aria-checked": ariaChecked,
    "aria-disabled": disabled || undefined,
    onClick: composeEventHandlers(onClick, handleClick),
  };
  if (asChild) {
    return <Slot {...itemProps}>{children}</Slot>;
  }
  return <li {...itemProps}>{children}</li>;
}

DropdownCheckboxItem.displayName = "DropdownCheckboxItem";

function DropdownRadioGroup({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  asChild = false,
  ...rest
}: DropdownRadioGroupProps) {
  const { value, select } = useRadioGroupRoot({
    defaultValue,
    value: controlledValue,
    onValueChange,
  });
  const contextValue = useMemo(() => ({ value, select }), [value, select]);
  const groupProps = { ...rest, role: "group" as const };
  return (
    <DropdownRadioGroupContext.Provider value={contextValue}>
      {asChild ? (
        <Slot {...groupProps}>{children}</Slot>
      ) : (
        <li {...groupProps}>
          <ul role="none">{children}</ul>
        </li>
      )}
    </DropdownRadioGroupContext.Provider>
  );
}

DropdownRadioGroup.displayName = "DropdownRadioGroup";

function DropdownRadioItem({
  children,
  onClick,
  onSelect,
  disabled,
  value: itemValue,
  asChild = false,
  ...rest
}: DropdownRadioItemProps) {
  const { setOpen, triggerRef } = useDropdownContext();
  const group = useContext(DropdownRadioGroupContext);
  if (!group) {
    throw new Error(
      "Dropdown.RadioItem must be rendered inside a <Dropdown.RadioGroup>.",
    );
  }
  const checked = group.value === itemValue;
  const handleClick = () => {
    if (disabled) return;
    group.select(itemValue);
    const event = new Event("dropdown.select", { cancelable: true });
    onSelect?.(event);
    if (!event.defaultPrevented) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };
  const itemProps = {
    ...rest,
    role: "menuitemradio" as const,
    tabIndex: -1,
    "aria-checked": checked,
    "aria-disabled": disabled || undefined,
    onClick: composeEventHandlers(onClick, handleClick),
  };
  if (asChild) {
    return <Slot {...itemProps}>{children}</Slot>;
  }
  return <li {...itemProps}>{children}</li>;
}

DropdownRadioItem.displayName = "DropdownRadioItem";

function DropdownSub({
  defaultOpen,
  open: controlledOpen,
  onOpenChange,
  children,
}: DropdownSubProps) {
  const { open, setOpen } = useDropdownRoot({
    defaultOpen,
    open: controlledOpen,
    onOpenChange,
  });
  const contentId = useId();
  const triggerRef = useRef<HTMLLIElement | null>(null);
  const contextValue = useMemo(
    () => ({ open, setOpen, contentId, triggerRef }),
    [open, setOpen, contentId],
  );
  return (
    <DropdownSubContext.Provider value={contextValue}>
      {children}
    </DropdownSubContext.Provider>
  );
}

DropdownSub.displayName = "DropdownSub";

function DropdownSubTrigger({
  children,
  onClick,
  onKeyDown,
  disabled,
  asChild = false,
  ...rest
}: DropdownSubTriggerProps) {
  const sub = useDropdownSubContext();
  const toggle = () => {
    if (disabled) return;
    sub.setOpen(!sub.open);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (disabled) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      sub.setOpen(true);
    }
  };
  const subTriggerProps = {
    ...rest,
    ref: sub.triggerRef,
    role: "menuitem" as const,
    tabIndex: -1,
    "aria-haspopup": "menu" as const,
    "aria-expanded": sub.open,
    "aria-controls": sub.contentId,
    "aria-disabled": disabled || undefined,
    onClick: composeEventHandlers(onClick, toggle),
    onKeyDown: composeEventHandlers(onKeyDown, handleKeyDown),
  };
  if (asChild) {
    return <Slot {...subTriggerProps}>{children}</Slot>;
  }
  return <li {...subTriggerProps}>{children}</li>;
}

DropdownSubTrigger.displayName = "DropdownSubTrigger";

function DropdownSubContent({
  children,
  onKeyDown,
  asChild = false,
  ...rest
}: DropdownSubContentProps) {
  const sub = useDropdownSubContext();
  const menuRef = useRef<HTMLMenuElement | null>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (sub.open) {
      menu.showPopover();
      if (!menu.contains(document.activeElement)) {
        const firstItem = menu.querySelector<HTMLElement>(MENUITEM_SELECTOR);
        firstItem?.focus();
      }
    } else {
      menu.hidePopover();
    }
  }, [sub.open]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLMenuElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      sub.setOpen(false);
      sub.triggerRef.current?.focus();
    }
  };

  const subContentProps = {
    ...rest,
    ref: menuRef,
    id: sub.contentId,
    role: "menu" as const,
    popover: "auto" as const,
    onKeyDown: composeEventHandlers(onKeyDown, handleKeyDown),
  };
  if (asChild) {
    return <Slot {...subContentProps}>{children}</Slot>;
  }
  return <menu {...subContentProps}>{children}</menu>;
}

DropdownSubContent.displayName = "DropdownSubContent";

type TDropdownCompound = typeof DropdownRoot & {
  Root: typeof DropdownRoot;
  Trigger: typeof DropdownTrigger;
  Content: typeof DropdownContent;
  Item: typeof DropdownItem;
  Separator: typeof DropdownSeparator;
  Group: typeof DropdownGroup;
  Label: typeof DropdownLabel;
  CheckboxItem: typeof DropdownCheckboxItem;
  RadioGroup: typeof DropdownRadioGroup;
  RadioItem: typeof DropdownRadioItem;
  Sub: typeof DropdownSub;
  SubTrigger: typeof DropdownSubTrigger;
  SubContent: typeof DropdownSubContent;
};

const DropdownCompound: TDropdownCompound = Object.assign(DropdownRoot, {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Separator: DropdownSeparator,
  Group: DropdownGroup,
  Label: DropdownLabel,
  CheckboxItem: DropdownCheckboxItem,
  RadioGroup: DropdownRadioGroup,
  RadioItem: DropdownRadioItem,
  Sub: DropdownSub,
  SubTrigger: DropdownSubTrigger,
  SubContent: DropdownSubContent,
});

DropdownCompound.displayName = "Dropdown";

export { DropdownCompound as Dropdown };
