import { useContext } from "react";
import { AccordionContext } from "../AccordionContext";

export function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionItem must be used within AccordionRoot");
  }
  return context;
}
