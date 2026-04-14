import {
  TabsOrientation,
  TabsReadingDirection,
  KeyToActionMapper,
} from "./types";

export function getTriggerAndPanelIds(tabsId: string, value?: string) {
  const triggerId = `${tabsId}-trigger-${value}`;
  const panelId = `${tabsId}-panel-${value}`;

  return { triggerId, panelId };
}

// Utility function for key-to-action mapping
export function getKeyToAction(
  orientation: TabsOrientation,
  dir: TabsReadingDirection,
): KeyToActionMapper {
  const keyToActionMap: KeyToActionMapper = {
    Home: "home",
    End: "end",
  };
  if (orientation === "horizontal") {
    // In RTL the arrow directions are inverted relative to DOM order
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const backward = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    keyToActionMap[forward] = "moveForward";
    keyToActionMap[backward] = "moveBackward";
  }
  if (orientation === "vertical") {
    keyToActionMap.ArrowDown = "moveForward";
    keyToActionMap.ArrowUp = "moveBackward";
  }
  return keyToActionMap;
}
