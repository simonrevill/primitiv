import { MouseEvent } from "react";

import type { MillerColumnsItemProps } from "../types";

import { useMillerColumnsContext } from "./useMillerColumnsContext";
import { useMillerColumnsColumnContext } from "./useMillerColumnsColumnContext";

export function useMillerColumnsItem(
  { value, onClick, ...rest }: Omit<MillerColumnsItemProps, "children">,
  hasChildren: boolean,
) {
  const { activePath, select } = useMillerColumnsContext();
  const { depth } = useMillerColumnsColumnContext();

  const selected = activePath[depth] === value;

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    onClick?.(event);
    select(depth, value);
  }

  const itemProps = {
    role: "treeitem",
    "aria-selected": selected,
    "data-state": selected ? "selected" : "unselected",
    "data-depth": depth,
    ...(hasChildren ? { "data-has-children": "" } : {}),
    onClick: handleClick,
    ...rest,
  };

  return { itemProps, selected };
}
