import { createContext } from "react";
import { AccordionContextValue, AccordionItemContextValue } from "./types";

export const AccordionContext = createContext<AccordionContextValue | null>(
  null,
);
export const AccordionItemContext =
  createContext<AccordionItemContextValue | null>(null);
