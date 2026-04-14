import { ComponentProps, Dispatch, RefObject, SetStateAction } from "react";

export type TabsOrientation = "horizontal" | "vertical";

export type TabsReadingDirection = "ltr" | "rtl";

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
} & BaseTabsRootProps &
  (UncontrolledTabsRootProps | ControlledTabsRootProps);

export type TabsContextValue = {
  orientation: TabsOrientation;
  dir: TabsReadingDirection;
  activeValue: string | undefined;
  isControlled: boolean;
  setActiveValue: Dispatch<SetStateAction<string | undefined>>;
  onValueChange?: (value: string) => void;
  onChange?: ({ index, name }: TabMetadata) => void;
  tabsId: string;
  registerTrigger: (value: string, element: HTMLButtonElement | null) => void;
  triggersRef: RefObject<Map<string, HTMLButtonElement>>;
};

export type TabsListProps = ComponentProps<"div"> & { label: string };

export type TabsTriggerProps = ComponentProps<"button"> & {
  disabled?: boolean;
  value: string;
};

export type TabsContentProps = ComponentProps<"div"> & {
  value?: string;
};

export type TabsKeyActionsKey =
  | "ArrowRight"
  | "ArrowLeft"
  | "ArrowDown"
  | "ArrowUp"
  | "Home"
  | "End";

export type TabsKeyActions = {
  moveForward: () => void;
  moveBackward: () => void;
  home: () => void;
  end: () => void;
};

export type KeyToActionMapper = Partial<
  Record<TabsKeyActionsKey, "moveForward" | "moveBackward" | "home" | "end">
>;

export type TabsImperativeApi = {
  setActiveTab: (value: string) => void;
};
