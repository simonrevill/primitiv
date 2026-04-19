import { useMemo, useState } from "react";

import { ModalContextValue } from "../types";

type UseModalRootArgs = {
  defaultOpen?: boolean;
};

export function useModalRoot({ defaultOpen = false }: UseModalRootArgs) {
  const [open, setOpen] = useState(defaultOpen);

  const contextValue = useMemo<ModalContextValue>(
    () => ({ open, setOpen }),
    [open],
  );

  return { contextValue };
}
