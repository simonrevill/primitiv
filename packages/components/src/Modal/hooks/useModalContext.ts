import { useContext } from "react";

import { ModalContext } from "../ModalContext";

export function useModalContext() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Component must be rendered as a child of Modal.Root");
  }

  return context;
}
