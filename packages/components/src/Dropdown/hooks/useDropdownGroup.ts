import { useId, useMemo } from "react";
import { DropdownGroupProps } from "../types";

type UseDropdownGroupArgs = {
  restProps: Omit<DropdownGroupProps, "children" | "asChild">;
};

export function useDropdownGroup({ restProps }: UseDropdownGroupArgs) {
  const labelId = useId();
  const contextValue = useMemo(() => ({ labelId }), [labelId]);
  const groupProps = {
    ...restProps,
    role: "group" as const,
    "aria-labelledby": labelId,
  };

  return { contextValue, groupProps };
}
