import { Carousel } from "@primitiv/components";

import "./CarouselExample.scss";

export function CarouselExample() {
  return (
    <Carousel.Root ariaLabel="Featured products" loop>
      <Carousel.Viewport>
        <Carousel.Slide data-testid="slide-0">
          <img
            src="https://placehold.co/600x400@2x.png/?text=Slide+1"
            alt="600 x 400 placeholder image"
          />
        </Carousel.Slide>
        <Carousel.Slide data-testid="slide-1">
          <img
            src="https://placehold.co/600x400@2x.png/?text=Slide+2"
            alt="600 x 400 placeholder image"
          />
        </Carousel.Slide>
        <Carousel.Slide data-testid="slide-2">
          <img
            src="https://placehold.co/600x400@2x.png/?text=Slide+3"
            alt="600 x 400 placeholder image"
          />
        </Carousel.Slide>
      </Carousel.Viewport>
      <Carousel.PreviousTrigger>Prev</Carousel.PreviousTrigger>
      <Carousel.NextTrigger>Next</Carousel.NextTrigger>
    </Carousel.Root>
  );
}
