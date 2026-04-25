import { useContext } from "react";
import { DropdownGroupContext } from "../DropdownGroupContext";
import { DropdownLabelProps } from "../types";

type UseDropdownLabelArgs = {
  id?: string;
  restProps: Omit<DropdownLabelProps, "id" | "children" | "asChild">;
};

export function useDropdownLabel({ id, restProps }: UseDropdownLabelArgs) {
  const group = useContext(DropdownGroupContext);
  const labelProps = { ...restProps, id: id ?? group?.labelId };

  return { labelProps };
}
