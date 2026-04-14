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

const TabsRoot = forwardRef<TabsImperativeApi, TabsRootProps>(function TabsRoot(
  {
    className = "",
    orientation = "horizontal",
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
        dir="ltr"
        className={className}
        data-orientation={contextValue.orientation}
        {...rest}
      />
    </TabsProvider>
  );
});

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

export function TabsTrigger({
  children,
  className = "",
  value,
  onClick,
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

const TabsCompound: TTabsCompound = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { TabsCompound as Tabs };
