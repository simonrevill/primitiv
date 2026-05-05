import { Carousel } from "@primitiv/components";

import "./CarouselExample.scss";

export function CarouselExample() {
  return (
    <Carousel.Root ariaLabel="Featured products" loop>
      <Carousel.Viewport>
        <Carousel.Slide data-testid="slide-0">1</Carousel.Slide>
        <Carousel.Slide data-testid="slide-1">2</Carousel.Slide>
        <Carousel.Slide data-testid="slide-2">3</Carousel.Slide>
      </Carousel.Viewport>
      <Carousel.PreviousTrigger>Prev</Carousel.PreviousTrigger>
      <Carousel.NextTrigger>Next</Carousel.NextTrigger>
    </Carousel.Root>
  );
}
