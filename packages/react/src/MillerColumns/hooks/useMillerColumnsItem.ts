import {
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { useRovingTabindex } from "../../hooks";

import type {
  MillerColumnsItemContextValue,
  MillerColumnsItemProps,
} from "../types";

import { useMillerColumnsContext } from "./useMillerColumnsContext";
import { useMillerColumnsColumnContext } from "./useMillerColumnsColumnContext";

export function useMillerColumnsItem(
  {
    value,
    onClick,
    onKeyDown,
    disabled = false,
    ...rest
  }: Omit<MillerColumnsItemProps, "children">,
  hasChildren: boolean,
) {
  const { activePath, select, registerItem, getColumnItems, focusItem } =
    useMillerColumnsContext();
  const { depth } = useMillerColumnsColumnContext();

  const selected = activePath[depth] === value;

  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerItem(depth, value, itemRef.current, disabled);
    return () => registerItem(depth, value, null, disabled);
  }, [depth, value, disabled, registerItem]);

  const enabledValues = getColumnItems(depth)
    .filter((item) => !item.disabled)
    .map((item) => item.value);

  const { handleKeyDown: rovingKeyDown } = useRovingTabindex<string>({
    orientation: "vertical",
    navigable: enabledValues,
    currentKey: value,
    includeHomeEnd: true,
    includeActivate: true,
    onNavigate: (target, action) => {
      if (action === "activate") {
        if (!disabled) {
          select(depth, value);
        }
        return;
      }
      focusItem(depth, target);
    },
  });

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (disabled) {
      return;
    }
    onClick?.(event);
    select(depth, value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    rovingKeyDown(event);
  }

  const itemProps = {
    ref: itemRef,
    role: "treeitem",
    tabIndex: -1,
    "aria-selected": selected,
    "data-state": selected ? "selected" : "unselected",
    "data-depth": depth,
    ...(hasChildren ? { "data-has-children": "" } : {}),
    ...(disabled ? { "aria-disabled": true, "data-disabled": "" } : {}),
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ...rest,
  };

  const itemContextValue = useMemo<MillerColumnsItemContextValue>(
    () => ({ selected, hasChildren }),
    [selected, hasChildren],
  );

  return { itemProps, selected, itemContextValue };
}
