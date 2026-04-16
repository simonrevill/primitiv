import { useContext } from "react";
import { AccordionContext } from "../AccordionContext";

export function useAccordionHeaderContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionHeader must be used within AccordionRoot");
  }
  return context;
}
