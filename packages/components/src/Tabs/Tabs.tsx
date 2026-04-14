import { forwardRef } from "react";

import {
  useTabsRoot,
  useTabsContext,
  useTabsTrigger,
  useTabsContent,
} from "./hooks";
import { TabsProvider } from "./TabsContext";
import type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsImperativeApi,
} from "./types";

/**
 * The root of a Tabs widget — owns the active value, provides context to
 * descendants, and renders a single container `<div dir="ltr">`.
 *
 * Supports two state modes, statically discriminated at the type level so
 * only one of the two shapes is accepted by TypeScript:
 *
 * - **Uncontrolled** — pass {@link TabsRootProps.defaultValue | `defaultValue`}
 *   (or omit it and let the first click seed the state). The component
 *   owns and updates the active value internally.
 * - **Controlled** — pass {@link TabsRootProps.value | `value`} *and*
 *   {@link TabsRootProps.onValueChange | `onValueChange`} together. The
 *   parent owns the active value; the component defers every state change
 *   back through the callback.
 *
 * An additional {@link TabsRootProps.onChange | `onChange({ index, name })`}
 * callback fires on every user-driven activation (click or keyboard)
 * independent of the control mode. Use it for analytics or side-effects
 * that shouldn't re-enter the state update path.
 *
 * An imperative handle is exposed via `ref`, exposing
 * {@link TabsImperativeApi.setActiveTab | `setActiveTab(value)`} for
 * programmatic activation (e.g. restoring a remembered tab on mount, or
 * reacting to a deep-linked hash):
 *
 * ```tsx
 * const tabsRef = useRef<TabsImperativeApi>(null);
 * tabsRef.current?.setActiveTab("settings");
 * ```
 *
 * **Runtime validation.** If `value`/`defaultValue` doesn't match any
 * registered `Tabs.Trigger`, a descriptive error is thrown during render
 * and typos surface early in development.
 *
 * **Styling hooks.** `data-orientation="horizontal" | "vertical"` is set
 * on the rendered container.
 *
 * @example Uncontrolled
 * ```tsx
 * <Tabs.Root defaultValue="overview">
 *   <Tabs.List label="Account sections">
 *     <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
 *     <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="overview">Dashboard…</Tabs.Content>
 *   <Tabs.Content value="settings">Preferences…</Tabs.Content>
 * </Tabs.Root>
 * ```
 *
 * @example Controlled with an analytics hook
 * ```tsx
 * const [tab, setTab] = useState("overview");
 *
 * <Tabs.Root
 *   value={tab}
 *   onValueChange={setTab}
 *   onChange={({ name, index }) => track("tab_view", { name, index })}
 * >
 *   …
 * </Tabs.Root>
 * ```
 *
 * @example Vertical orientation + imperative API
 * ```tsx
 * const ref = useRef<TabsImperativeApi>(null);
 *
 * <Tabs.Root ref={ref} orientation="vertical" defaultValue="one">
 *   …
 * </Tabs.Root>
 *
 * <button onClick={() => ref.current?.setActiveTab("two")}>Go to two</button>
 * ```
 */
const TabsRoot = forwardRef<TabsImperativeApi, TabsRootProps>(function TabsRoot(
  {
    className = "",
    orientation = "horizontal",
    dir = "ltr",
    defaultValue,
    value,
    onValueChange,
    onChange,
    ...rest
  },
  ref,
) {
  const { contextValue } = useTabsRoot(
    {
      orientation,
      dir,
      defaultValue,
      value,
      onValueChange,
      onChange,
    },
    ref,
  );

  return (
    <TabsProvider value={contextValue}>
      <div
        dir={dir}
        className={className}
        data-orientation={contextValue.orientation}
        {...rest}
      />
    </TabsProvider>
  );
});

/**
 * The tablist — an accessible container for `Tabs.Trigger` elements.
 *
 * Renders a `<div role="tablist">` with `aria-orientation` inherited from
 * the nearest {@link TabsRoot | `Tabs.Root`}. The
 * {@link TabsListProps.label | `label`} prop is **required** and becomes
 * the `aria-label` announced to assistive technology when the tablist
 * receives focus — pick a short, human-readable description of the set of
 * tabs (e.g. `"Account sections"`, not `"Tabs"`).
 *
 * **Styling hooks.** `data-orientation="horizontal" | "vertical"`.
 *
 * @example
 * ```tsx
 * <Tabs.List label="Document sections">
 *   <Tabs.Trigger value="title">Title</Tabs.Trigger>
 *   <Tabs.Trigger value="body">Body</Tabs.Trigger>
 * </Tabs.List>
 * ```
 */
export function TabsList({
  children,
  className = "",
  label,
  ...rest
}: TabsListProps) {
  const { orientation } = useTabsContext();

  return (
    <div
      role="tablist"
      className={className}
      aria-orientation={orientation}
      aria-label={label}
      data-orientation={orientation}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * An individual tab button. Renders `<button role="tab">` with full ARIA
 * linkage, roving tabindex, and keyboard navigation handled automatically.
 *
 * **Value linkage.** Each trigger is identified by a unique
 * {@link TabsTriggerProps.value | `value`} string; the matching
 * `Tabs.Content` must share the same value. The IDs used for
 * `aria-controls` and `aria-labelledby` are derived from the root's
 * `useId()` plus the trigger's `value`, so they're stable and unique even
 * when multiple `Tabs` instances coexist on a page.
 *
 * **Keyboard support** (WAI-ARIA Tabs pattern, automatic activation):
 *
 * | Key                          | Behaviour                              |
 * | ---------------------------- | -------------------------------------- |
 * | `ArrowRight` / `ArrowLeft`   | Move between triggers (horizontal)     |
 * | `ArrowDown`  / `ArrowUp`     | Move between triggers (vertical)       |
 * | `Home` / `End`               | Jump to first / last trigger           |
 *
 * Movement **wraps** at the ends. Activation is **automatic** on focus
 * movement, which is the recommended pattern for small, immediately-
 * loadable panels. For panels that are expensive to render, consider
 * using the controlled mode and debouncing panel swaps yourself.
 *
 * **Styling hooks.**
 * - `data-state="active" | "inactive"` on the rendered button.
 * - `data-orientation="horizontal" | "vertical"`.
 *
 * @example
 * ```tsx
 * <Tabs.Trigger value="account">Account</Tabs.Trigger>
 * ```
 *
 * @example Icon + label
 * ```tsx
 * <Tabs.Trigger value="billing">
 *   <CreditCardIcon aria-hidden />
 *   <span>Billing</span>
 * </Tabs.Trigger>
 * ```
 */
export function TabsTrigger({
  children,
  className = "",
  value,
  onClick,
  disabled = false,
  ...rest
}: TabsTriggerProps) {
  const {
    buttonRef,
    triggerId,
    panelId,
    isActive,
    orientation,
    state,
    tabIndex,
    handleClick,
    handleKeyDown,
  } = useTabsTrigger({ value, onClick });

  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      className={className}
      id={triggerId}
      aria-controls={panelId}
      aria-selected={isActive}
      data-orientation={orientation}
      data-state={state}
      tabIndex={tabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * A panel associated with a `Tabs.Trigger` of the same
 * {@link TabsContentProps.value | `value`}.
 *
 * Renders `<div role="tabpanel">` with `aria-labelledby` pointing at the
 * matching trigger, and uses the native `hidden` attribute to toggle
 * visibility. Inactive panels remain **mounted** — this preserves
 * component state (scroll position, form input, animation state) across
 * tab switches. If you need true unmount semantics (e.g. to tear down
 * expensive subscriptions), render the `Tabs.Content` conditionally
 * yourself based on the active value.
 *
 * **Styling hooks.**
 * - `data-state="active" | "inactive"`.
 * - `data-orientation="horizontal" | "vertical"`.
 *
 * @example
 * ```tsx
 * <Tabs.Content value="account">
 *   <AccountForm />
 * </Tabs.Content>
 * ```
 */
export function TabsContent({
  children,
  className = "",
  value,
  ...rest
}: TabsContentProps) {
  const { panelId, triggerId, orientation, isActive, state, tabIndex } =
    useTabsContent({ value });

  return (
    <div
      role="tabpanel"
      className={className}
      id={panelId}
      aria-labelledby={triggerId}
      data-orientation={orientation}
      data-state={state}
      hidden={!isActive}
      tabIndex={tabIndex}
      {...rest}
    >
      {children}
    </div>
  );
}

type TTabsCompound = typeof TabsRoot & {
  Root: typeof TabsRoot;
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
};

/**
 * Headless, accessible **Tabs** — a compound component implementing the
 * WAI-ARIA Tabs pattern with zero styles.
 *
 * `Tabs` is both callable (it's an alias of {@link TabsRoot | `Tabs.Root`})
 * and carries its sub-components as static properties. Prefer the
 * namespaced form in application code for readability and grep-ability:
 *
 * - {@link TabsRoot | `Tabs.Root`} — state owner, context provider, imperative API holder.
 * - {@link TabsList | `Tabs.List`} — `role="tablist"` container for triggers.
 * - {@link TabsTrigger | `Tabs.Trigger`} — individual `role="tab"` button.
 * - {@link TabsContent | `Tabs.Content`} — `role="tabpanel"` panel, linked to a trigger by `value`.
 *
 * @example Minimal usage
 * ```tsx
 * import { Tabs } from "@primitiv/components";
 *
 * export function Demo() {
 *   return (
 *     <Tabs.Root defaultValue="a">
 *       <Tabs.List label="Demo tabs">
 *         <Tabs.Trigger value="a">First</Tabs.Trigger>
 *         <Tabs.Trigger value="b">Second</Tabs.Trigger>
 *       </Tabs.List>
 *       <Tabs.Content value="a">First panel</Tabs.Content>
 *       <Tabs.Content value="b">Second panel</Tabs.Content>
 *     </Tabs.Root>
 *   );
 * }
 * ```
 *
 * @example Styling with any system
 * Because no styles ship with the component, target the rendered elements
 * or the `data-state` / `data-orientation` hooks with whatever system you
 * use (CSS, CSS-in-JS, Tailwind, design-token stylesheets, etc.):
 *
 * ```css
 * [role="tab"][data-state="active"] { border-bottom: 2px solid currentColor; }
 * [role="tabpanel"][data-state="inactive"] { display: none; }
 * ```
 *
 * @see {@link TabsRoot} for state modes, validation behaviour, and the
 *   imperative API.
 * @see {@link TabsList} for the required `label` prop.
 * @see {@link TabsTrigger} for the full keyboard-interaction table.
 * @see {@link TabsContent} for panel lifecycle and unmount semantics.
 */
const TabsCompound: TTabsCompound = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { TabsCompound as Tabs };
