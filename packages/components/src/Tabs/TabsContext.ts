import { createStrictContext } from "../utils";

import { TabsContextValue } from "./types";

export const [TabsContext, useTabsContext] =
  createStrictContext<TabsContextValue>(
    "Component must be rendered as a child of Tabs.Root",
    "TabsContext",
  );

const TabsProvider = TabsContext.Provider;

export { TabsProvider };
