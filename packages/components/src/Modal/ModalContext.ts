import { createContext } from "react";

import { ModalContextValue } from "./types";

export const ModalContext = createContext<ModalContextValue | null>(null);
ModalContext.displayName = "ModalContext";
const ModalProvider = ModalContext.Provider;

export { ModalProvider };
