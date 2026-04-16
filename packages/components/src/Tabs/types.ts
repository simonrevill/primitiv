import { ComponentProps, Dispatch, RefObject, SetStateAction } from "react";

export type TabsOrientation = "horizontal" | "vertical";

export type TabsReadingDirection = "ltr" | "rtl";

export type TabsActivationMode = "automatic" | "manual";

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
export type TabsTriggerProps = ComponentProps<"button"> & {
  disabled?: boolean;
  value: string;
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
