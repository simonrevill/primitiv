import { useContext } from "react";
import { AccordionItemContext } from "../AccordionContext";

export function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("Component must be used within AccordionItem");
  }
  return context;
}
