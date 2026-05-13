import { createPortal } from "react-dom";

import type { PortalProps } from "./types";

function Portal({ children, container }: PortalProps) {
  return createPortal(children, container ?? document.body);
}

Portal.displayName = "Portal";

export { Portal };
