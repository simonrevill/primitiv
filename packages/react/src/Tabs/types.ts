import { ComponentProps, Ref } from "react";

export type TabsOrientation = "horizontal" | "vertical";

export type TabsReadingDirection = "ltr" | "rtl";

export type TabsActivationMode = "automatic" | "manual";

/**
 * Payload delivered to the {@link BaseTabsRootProps.onChange | `onChange`} callback
 * on every user-driven tab activation.
 *
 * - `index` — zero-based position of the activated trigger in registration order.
 * - `name`  — the programmatic **value** string passed to `Tabs.Trigger` (e.g.
 *   `"settings"`), **not** the human-readable label text rendered inside the
 *   trigger. Use the `children` of the trigger for the visible label.
 */
export type TabMetadata = { index: number; name: string };

export type BaseTabsRootProps = {
  onChange?: ({ index, name }: TabMetadata) => void;
};

export type UncontrolledTabsRootProps = {
  defaultValue?: string;
  value?: never;
  onValueChange?: never;
};

type ControlledTabsRootProps = {
  value: string;
  onValueChange: (value: string) => void;
  defaultValue?: never;
};

export type TabsRootProps = Omit<ComponentProps<"div">, "onChange"> & {
  orientation?: TabsOrientation;
  dir?: TabsReadingDirection;
  activationMode?: TabsActivationMode;
  /** When `true`, a panel's children are not rendered until that tab is first
   * activated. Once mounted they remain in the DOM across subsequent tab
   * switches (lazy mount, not unmount-on-hide). Useful for panels that own
   * expensive initialisation — e.g. a scroll-snap carousel whose initial
   * scroll position must be set while the panel is visible. */
  lazyMount?: boolean;
} & BaseTabsRootProps &
  (UncontrolledTabsRootProps | ControlledTabsRootProps);

export type TabsContextValue = {
  orientation: TabsOrientation;
  dir: TabsReadingDirection;
  activationMode: TabsActivationMode;
  activeValue: string | undefined;
  isControlled: boolean;
  setActiveValue: (next: string) => void;
  onValueChange?: (value: string) => void;
  onChange?: ({ index, name }: TabMetadata) => void;
  tabsId: string;
  lazyMount: boolean;
  registerTrigger: (
    value: string,
    element: HTMLButtonElement | null,
    disabled?: boolean,
  ) => void;
  triggerValues: string[];
  disabledTriggerValues: Set<string>;
  focusTrigger: (value: string) => void;
};

export type TabsListProps = Omit<
  ComponentProps<"div">,
  "label" | "aria-labelledby"
> &
  (
    | { label: string; ariaLabelledBy?: never }
    | { label?: never; ariaLabelledBy: string }
  );
export type TabsTriggerProps<T extends HTMLElement = HTMLButtonElement> = Omit<
  ComponentProps<"button">,
  "ref"
> & {
  disabled?: boolean;
  value: string;
  /** Render the child element instead of the default `<button>`. All tab
   * ARIA attributes and event handlers are merged onto the child. The child
   * must accept a `ref`. Useful for routing links that need tab semantics. */
  asChild?: boolean;
  /** Ref to the rendered element. Defaults to `HTMLButtonElement`; when using
   * `asChild`, specify the child's element type (e.g. `HTMLAnchorElement`). */
  ref?: Ref<T>;
};

export type TabsContentProps = ComponentProps<"div"> & {
  value: string;
};

export type TabsImperativeApi = {
  setActiveTab: (value: string) => void;
};
