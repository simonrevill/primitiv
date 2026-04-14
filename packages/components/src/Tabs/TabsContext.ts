import { createContext } from "react";

import { TabsContextValue } from "./types";

export const TabsContext = createContext<TabsContextValue | null>(null);

const TabsProvider = TabsContext.Provider;

export { TabsProvider };
