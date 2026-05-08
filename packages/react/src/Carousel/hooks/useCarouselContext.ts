import { useContext } from "react";

import { CarouselContext } from "../CarouselContext";

export function useCarouselContext() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("Component must be rendered as a child of Carousel.Root");
  }

  return context;
}
