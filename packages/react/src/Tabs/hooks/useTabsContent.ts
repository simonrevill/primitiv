import { TabsContentProps } from "../types";
import { getTriggerAndPanelIds } from "../utils";

import { useTabsContext } from ".";

export function useTabsContent({ value }: Pick<TabsContentProps, "value">) {
  const { orientation, activeValue, tabsId } = useTabsContext();
  const isActive = activeValue === value;
  const { triggerId, panelId } = getTriggerAndPanelIds(tabsId, value);
  const state = isActive ? "active" : "inactive";
  const tabIndex = isActive ? 0 : -1;

  return { panelId, triggerId, orientation, isActive, state, tabIndex };
}
