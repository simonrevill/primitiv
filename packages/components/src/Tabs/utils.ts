import { TabsOrientation, KeyToActionMapper } from "./types";

export function getTriggerAndPanelIds(
  tabsId: string,
  value: string | number | readonly string[] | undefined,
) {
  const triggerId = `${tabsId}-trigger-${value}`;
  const panelId = `${tabsId}-panel-${value}`;

  return { triggerId, panelId };
}

// Utility function for key-to-action mapping
export function getKeyToAction(
  orientation: TabsOrientation,
): KeyToActionMapper {
  const keyToActionMap: KeyToActionMapper = {
    Home: "home",
    End: "end",
  };
  if (orientation === "horizontal") {
    keyToActionMap.ArrowRight = "moveForward";
    keyToActionMap.ArrowLeft = "moveBackward";
  }
  if (orientation === "vertical") {
    keyToActionMap.ArrowDown = "moveForward";
    keyToActionMap.ArrowUp = "moveBackward";
  }
  return keyToActionMap;
}
