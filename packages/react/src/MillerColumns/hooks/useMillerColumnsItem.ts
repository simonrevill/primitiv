import { MouseEvent, useMemo } from "react";

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
    disabled = false,
    ...rest
  }: Omit<MillerColumnsItemProps, "children">,
  hasChildren: boolean,
) {
  const { activePath, select } = useMillerColumnsContext();
  const { depth } = useMillerColumnsColumnContext();

  const selected = activePath[depth] === value;

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (disabled) {
      return;
    }
    onClick?.(event);
    select(depth, value);
  }

  const itemProps = {
    role: "treeitem",
    "aria-selected": selected,
    "data-state": selected ? "selected" : "unselected",
    "data-depth": depth,
    ...(hasChildren ? { "data-has-children": "" } : {}),
    ...(disabled ? { "aria-disabled": true, "data-disabled": "" } : {}),
    onClick: handleClick,
    ...rest,
  };

  const itemContextValue = useMemo<MillerColumnsItemContextValue>(
    () => ({ selected, hasChildren }),
    [selected, hasChildren],
  );

  return { itemProps, selected, itemContextValue };
}
