import { useContext, useEffect, useId, useMemo, useRef, useState } from "react";

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

/**
 * The root of a Dropdown menu — owns the open state and provides context to
 * descendants. Renders no DOM of its own; it is a context boundary.
 *
 * Supports two state modes, statically discriminated at the type level so
 * only one shape is accepted by TypeScript:
 *
 * - **Uncontrolled** — pass {@link DropdownRootProps.defaultOpen | `defaultOpen`}
 *   (or omit it to start closed). The component owns and updates the open
 *   state internally. Optional {@link DropdownRootProps.onOpenChange | `onOpenChange`}
 *   observes transitions.
 * - **Controlled** — pass {@link DropdownRootProps.open | `open`} *and*
 *   {@link DropdownRootProps.onOpenChange | `onOpenChange`} together. The
 *   parent owns the state; the component defers every transition back through
 *   the callback.
 *
 * Only user-driven transitions (trigger clicks, Escape, selection) invoke
 * `onOpenChange`. External state flips made by the parent do not.
 *
 * @example Uncontrolled
 * ```tsx
 * <Dropdown.Root>
 *   <Dropdown.Trigger>Options</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Rename</Dropdown.Item>
 *     <Dropdown.Item>Delete</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown.Root>
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Dropdown.Root open={open} onOpenChange={setOpen}>
 *   …
 * </Dropdown.Root>
 * ```
 */
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

/**
 * The menu button. Toggles the Dropdown open/closed on click and exposes
 * the ARIA contract for WAI-ARIA Menu Button: `aria-haspopup="menu"`,
 * `aria-expanded` reflecting the open state, and `aria-controls` pointing
 * at the content's id.
 *
 * Renders a `<button type="button">` by default. Pass `asChild` to render
 * the composed child element instead (e.g. a link, or a custom button
 * component). All ARIA attributes and event handlers are merged onto the
 * child following the {@link Slot} composition rules.
 *
 * @example With an anchor via `asChild`
 * ```tsx
 * <Dropdown.Trigger asChild>
 *   <a href="#options">Options</a>
 * </Dropdown.Trigger>
 * ```
 */
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

/**
 * The menu panel rendered with the native HTML
 * [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
 * (`popover="auto"`) — no portal, no floating-ui. The browser manages
 * layering via the top layer and dispatches a light-dismiss on outside
 * click and Escape in the light-dismiss flow.
 *
 * Renders a `<menu role="menu">` by default; pass `asChild` to render
 * any element with menu semantics.
 *
 * **Keyboard interaction.** While the menu is open:
 *
 * | Key                     | Behaviour                                          |
 * | ----------------------- | -------------------------------------------------- |
 * | `ArrowDown` / `ArrowUp` | Move focus to next / previous item (wraps)         |
 * | `Home` / `End`          | Jump to first / last item                          |
 * | `Enter` / `Space`       | Activate the focused item                          |
 * | `Escape`                | Close the menu and return focus to the trigger     |
 * | any printable character | Typeahead — focuses the next item matching prefix  |
 *
 * Typeahead accumulates keystrokes within a 500 ms window; pressing the
 * same character repeatedly cycles through items that share that first
 * letter. Disabled items are skipped during arrow navigation and typeahead.
 */
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
    const menu = menuRef.current!;
    if (open) {
      menu.showPopover();
      if (!menu.contains(document.activeElement)) {
        const firstItem = menu.querySelector<HTMLElement>(MENUITEM_SELECTOR);
        firstItem?.focus();
      }
    } else {
      try {
        menu.hidePopover();
      } catch {
        // already hidden — no-op (e.g. browser already light-dismissed it)
      }
    }
  }, [open]);

  // Track open in a ref so the document click listener always sees the latest
  // value without needing it as a dependency (avoids listener churn).
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  });

  // Sync React state when the browser closes the popover without our code
  // doing it (real-browser ToggleEvent on light-dismiss or native Escape).
  useEffect(() => {
    const menu = menuRef.current!;
    const handleToggle = (event: Event) => {
      if ((event as ToggleEvent).newState === "closed") setOpen(false);
    };
    menu.addEventListener("toggle", handleToggle);
    return () => menu.removeEventListener("toggle", handleToggle);
  }, [setOpen]);

  // Belt-and-suspenders for environments where the toggle event is not
  // dispatched on light-dismiss (e.g. jsdom). Skip clicks that land inside
  // any [popover] element so nested sub-menus don't close their parent.
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!openRef.current) return;
      if (!(event.target as Element).closest?.("[popover]")) setOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [setOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLMenuElement>) => {
    const menu = menuRef.current!;
    const items = Array.from(
      menu.querySelectorAll<HTMLElement>(MENUITEM_SELECTOR),
    );
    if (items.length === 0) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
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
        const text = items[index].textContent!.trim().toLowerCase();
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

/**
 * A standard menu item. Renders a `<li role="menuitem">` by default; pass
 * `asChild` to render any element with menuitem semantics.
 *
 * Clicking the item (or pressing Enter / Space while focused) fires
 * {@link DropdownItemProps.onSelect | `onSelect`} with a cancellable
 * `Event`. The menu auto-closes after selection; call
 * `event.preventDefault()` inside `onSelect` to keep it open — useful
 * for actions that perform in-place mutations (e.g. copying to clipboard).
 *
 * Receives `data-highlighted=""` while the pointer is over it, making CSS
 * hover styling possible without `:hover` (which doesn't survive focus moves).
 *
 * Disabled items receive `aria-disabled="true"` and are skipped by arrow
 * navigation, typeahead, and activation handlers.
 */
function DropdownItem({
  children,
  onClick,
  onSelect,
  disabled,
  asChild = false,
  ...rest
}: DropdownItemProps) {
  const { setOpen, triggerRef } = useDropdownContext();
  const [highlighted, setHighlighted] = useState(false);
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
    "data-highlighted": highlighted ? "" : undefined,
    onClick: composeEventHandlers(onClick, handleClick),
    onMouseEnter: composeEventHandlers(rest.onMouseEnter, () =>
      setHighlighted(true),
    ),
    onMouseLeave: composeEventHandlers(rest.onMouseLeave, () =>
      setHighlighted(false),
    ),
  };
  if (asChild) {
    return <Slot {...itemProps}>{children}</Slot>;
  }
  return <li {...itemProps}>{children}</li>;
}

DropdownItem.displayName = "DropdownItem";

/**
 * A visual separator between groups of items. Renders a `<li role="separator">`
 * by default; pass `asChild` to render any element with separator semantics.
 * Non-interactive — skipped by focus, arrow navigation, and typeahead.
 */
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

/**
 * A semantic grouping of related items. Renders as a `<li role="group">`
 * wrapping an inner `<ul role="none">`, or — with `asChild` — a single
 * grouping element composed onto the provided child.
 *
 * Generates a stable id for its accompanying {@link DropdownLabel | `Dropdown.Label`},
 * wired automatically via `aria-labelledby`. Nest a `Dropdown.Label` as the
 * first child to provide the accessible name; screen readers will announce
 * the group when arrowing into it.
 */
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

/**
 * A non-interactive label, typically used inside a {@link DropdownGroup |
 * `Dropdown.Group`} to give that group an accessible name. When nested in
 * a group, the label's `id` is auto-wired to the group's `aria-labelledby`
 * — consumers don't need to thread ids manually.
 *
 * Renders a `<li>` by default; pass `asChild` to render any element. A
 * caller-supplied `id` takes precedence over the auto-generated one.
 */
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

/**
 * A toggleable menu item. Renders a `<li role="menuitemcheckbox">` with
 * `aria-checked` reflecting the current state. `asChild` is supported.
 *
 * Supports a WAI-ARIA tri-state: `true`, `false`, or `"indeterminate"`
 * (encoded as `aria-checked="mixed"`). An indeterminate item resolves to
 * `true` on the next activation, matching the native `<input type="checkbox">`
 * behaviour.
 *
 * State modes are discriminated at the type level:
 *
 * - **Uncontrolled** — pass `defaultChecked` (or omit to start unchecked).
 *   Optional `onCheckedChange` observes toggles.
 * - **Controlled** — pass `checked` *and* `onCheckedChange` together.
 *
 * Activation (click / Enter / Space) toggles the checked state, then
 * fires {@link DropdownCheckboxItemProps.onSelect | `onSelect`} with a
 * cancellable `Event`. Call `event.preventDefault()` to keep the menu
 * open — useful for rapidly toggling multiple checkboxes.
 *
 * Receives `data-highlighted=""` while the pointer is over it.
 *
 * Disabled items receive `aria-disabled="true"` and no-op on activation.
 */
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
  const [highlighted, setHighlighted] = useState(false);
  const { checked, toggle } = useCheckboxRoot({
    defaultChecked,
    checked: controlledChecked,
    onCheckedChange,
  });
  const ariaChecked: "mixed" | "true" | "false" =
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
    "data-highlighted": highlighted ? "" : undefined,
    onClick: composeEventHandlers(onClick, handleClick),
    onMouseEnter: composeEventHandlers(rest.onMouseEnter, () =>
      setHighlighted(true),
    ),
    onMouseLeave: composeEventHandlers(rest.onMouseLeave, () =>
      setHighlighted(false),
    ),
  };
  if (asChild) {
    return <Slot {...itemProps}>{children}</Slot>;
  }
  return <li {...itemProps}>{children}</li>;
}

DropdownCheckboxItem.displayName = "DropdownCheckboxItem";

/**
 * A single-selection group of menu items. Children must be
 * {@link DropdownRadioItem | `Dropdown.RadioItem`} elements. Renders a
 * `<li role="group">` wrapping `<ul role="none">`, or — with `asChild` —
 * composes onto the provided child.
 *
 * State modes are discriminated at the type level:
 *
 * - **Uncontrolled** — pass `defaultValue` (or omit for no initial selection).
 *   Optional `onValueChange` observes selections.
 * - **Controlled** — pass `value` *and* `onValueChange` together.
 */
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

/**
 * A single radio choice. Must be rendered inside a
 * {@link DropdownRadioGroup | `Dropdown.RadioGroup`}; rendering it outside
 * one throws a descriptive error.
 *
 * Renders a `<li role="menuitemradio">` with `aria-checked` reflecting
 * whether this item's `value` matches the group's active value. `asChild`
 * is supported.
 *
 * Activation (click / Enter / Space) selects this item, updating the
 * group's value, then fires {@link DropdownRadioItemProps.onSelect |
 * `onSelect`} with a cancellable `Event`. Call `event.preventDefault()`
 * to keep the menu open.
 *
 * Receives `data-highlighted=""` while the pointer is over it.
 *
 * Disabled items receive `aria-disabled="true"` and no-op on activation.
 */
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
  const [highlighted, setHighlighted] = useState(false);
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
    "data-highlighted": highlighted ? "" : undefined,
    onClick: composeEventHandlers(onClick, handleClick),
    onMouseEnter: composeEventHandlers(rest.onMouseEnter, () =>
      setHighlighted(true),
    ),
    onMouseLeave: composeEventHandlers(rest.onMouseLeave, () =>
      setHighlighted(false),
    ),
  };
  if (asChild) {
    return <Slot {...itemProps}>{children}</Slot>;
  }
  return <li {...itemProps}>{children}</li>;
}

DropdownRadioItem.displayName = "DropdownRadioItem";

/**
 * A submenu boundary. Wrap a {@link DropdownSubTrigger | `Dropdown.SubTrigger`}
 * and its {@link DropdownSubContent | `Dropdown.SubContent`} in a
 * `Dropdown.Sub` to establish an independent open state for the nested menu.
 *
 * Supports uncontrolled (`defaultOpen`) and controlled (`open` +
 * `onOpenChange`) modes, discriminated at the type level — same contract
 * as {@link DropdownRoot | `Dropdown.Root`}.
 *
 * @example
 * ```tsx
 * <Dropdown.Root>
 *   <Dropdown.Trigger>File</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Sub>
 *       <Dropdown.SubTrigger>Open Recent</Dropdown.SubTrigger>
 *       <Dropdown.SubContent>
 *         <Dropdown.Item>Project A</Dropdown.Item>
 *         <Dropdown.Item>Project B</Dropdown.Item>
 *       </Dropdown.SubContent>
 *     </Dropdown.Sub>
 *   </Dropdown.Content>
 * </Dropdown.Root>
 * ```
 */
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

/**
 * The submenu trigger. Must be rendered inside a {@link DropdownSub |
 * `Dropdown.Sub`}; rendering it outside one throws a descriptive error.
 *
 * Renders a `<li role="menuitem">` with `aria-haspopup="menu"`,
 * `aria-expanded`, and `aria-controls` wiring it to the sibling
 * {@link DropdownSubContent | `Dropdown.SubContent`}. `asChild` is supported.
 *
 * Opens the submenu on pointer enter (hover), click, or `ArrowRight`. Click
 * always opens — it never toggles — so hovering then clicking does not
 * reverse the state. All other keys bubble to the parent
 * {@link DropdownContent | `Dropdown.Content`} so its roving focus and
 * typeahead continue to work while a submenu is in play.
 *
 * Receives `data-highlighted=""` while the pointer is over it or while its
 * sub-menu is open, keeping the active path visually highlighted during
 * nested navigation.
 *
 * Disabled triggers receive `aria-disabled="true"` and ignore pointer enter,
 * click, and `ArrowRight`.
 */
function DropdownSubTrigger({
  children,
  onClick,
  onKeyDown,
  disabled,
  asChild = false,
  ...rest
}: DropdownSubTriggerProps) {
  const sub = useDropdownSubContext();
  const [hovered, setHovered] = useState(false);
  const toggle = () => {
    if (disabled) return;
    sub.setOpen(true);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (disabled) return;
    if (event.key !== "ArrowRight") return;
    event.preventDefault();
    event.stopPropagation();
    sub.setOpen(true);
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
    "data-highlighted": hovered || sub.open ? "" : undefined,
    onClick: composeEventHandlers(onClick, toggle),
    onKeyDown: composeEventHandlers(onKeyDown, handleKeyDown),
    onMouseEnter: composeEventHandlers(rest.onMouseEnter, () => {
      setHovered(true);
      if (!disabled) sub.setOpen(true);
    }),
    onMouseLeave: composeEventHandlers(rest.onMouseLeave, () =>
      setHovered(false),
    ),
  };
  if (asChild) {
    return <Slot {...subTriggerProps}>{children}</Slot>;
  }
  return <li {...subTriggerProps}>{children}</li>;
}

DropdownSubTrigger.displayName = "DropdownSubTrigger";

/**
 * The submenu panel. Must be rendered inside a {@link DropdownSub |
 * `Dropdown.Sub`}; rendering it outside one throws a descriptive error.
 *
 * Renders a `<menu role="menu" popover="auto">` by default; pass `asChild`
 * to render any element with menu semantics. When the submenu opens, focus
 * moves to its first enabled item.
 *
 * Presses of `ArrowLeft` close the submenu and return focus to the
 * {@link DropdownSubTrigger | `Dropdown.SubTrigger`}; all other keys bubble
 * to the parent {@link DropdownContent | `Dropdown.Content`} so arrow
 * navigation and typeahead apply to the submenu's items.
 */
function DropdownSubContent({
  children,
  onKeyDown,
  asChild = false,
  ...rest
}: DropdownSubContentProps) {
  const sub = useDropdownSubContext();
  const menuRef = useRef<HTMLMenuElement | null>(null);

  useEffect(() => {
    const menu = menuRef.current!;
    if (sub.open) {
      menu.showPopover();
      const firstItem = menu.querySelector<HTMLElement>(MENUITEM_SELECTOR);
      firstItem?.focus();
    } else {
      try {
        menu.hidePopover();
      } catch {
        // already hidden — no-op
      }
    }
  }, [sub.open]);

  useEffect(() => {
    const menu = menuRef.current!;
    const handleToggle = (event: ToggleEvent) => {
      if (event.newState === "closed") sub.setOpen(false);
    };
    menu.addEventListener("toggle", handleToggle);
    return () => menu.removeEventListener("toggle", handleToggle);
  }, [sub.setOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLMenuElement>) => {
    if (event.key !== "ArrowLeft") return;
    event.preventDefault();
    event.stopPropagation();
    sub.setOpen(false);
    sub.triggerRef.current?.focus();
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
