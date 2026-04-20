import { useCallback, useState } from "react";

type UseDropdownRootArgs = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function useDropdownRoot({
  defaultOpen = false,
}: UseDropdownRootArgs) {
  const [open, setInternalOpen] = useState(defaultOpen);

  const setOpen = useCallback((next: boolean) => {
    setInternalOpen(next);
  }, []);

  return { open, setOpen };
}
