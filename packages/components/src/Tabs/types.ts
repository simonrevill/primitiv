import { ComponentProps, Dispatch, Ref, RefObject, SetStateAction } from "react";

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
} & BaseTabsRootProps &
  (UncontrolledTabsRootProps | ControlledTabsRootProps);

export type TabsContextValue = {
  orientation: TabsOrientation;
  dir: TabsReadingDirection;
  activationMode: TabsActivationMode;
  activeValue: string | undefined;
  isControlled: boolean;
  setActiveValue: Dispatch<SetStateAction<string | undefined>>;
  onValueChange?: (value: string) => void;
  onChange?: ({ index, name }: TabMetadata) => void;
  tabsId: string;
  registerTrigger: (value: string, element: HTMLButtonElement | null) => void;
  triggersRef: RefObject<Map<string, HTMLButtonElement>>;
  triggerValues: string[];
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

export type TabsKeyActionsKey =
  | "ArrowRight"
  | "ArrowLeft"
  | "ArrowDown"
  | "ArrowUp"
  | "Home"
  | "End"
  | " "
  | "Enter";

export type TabsKeyActions = {
  moveForward: () => void;
  moveBackward: () => void;
  home: () => void;
  end: () => void;
  enter: () => void;
};

export type KeyToActionMapper = Partial<
  Record<
    TabsKeyActionsKey,
    "moveForward" | "moveBackward" | "home" | "end" | "enter"
  >
>;

export type TabsImperativeApi = {
  setActiveTab: (value: string) => void;
};
