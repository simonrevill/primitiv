import { RefObject } from "react";

import { createStrictContext } from "../utils";

export type DropdownSubContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerRef: RefObject<HTMLLIElement | null>;
};

export const [DropdownSubContext, useDropdownSubContext] =
  createStrictContext<DropdownSubContextValue>(
    "Dropdown.SubTrigger and Dropdown.SubContent must be rendered inside a <Dropdown.Sub>.",
  );
