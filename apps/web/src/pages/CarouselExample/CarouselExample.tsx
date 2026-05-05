import { Carousel } from "@primitiv/components";

import "./CarouselExample.scss";

export function CarouselExample() {
  return (
    <Carousel.Root ariaLabel="Featured products" loop>
      <Carousel.Viewport>
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <Carousel.Slide key={item}>
            <img
              src={`https://placehold.co/600x400@2x.png/?text=Slide+${index + 1}`}
              alt="600 x 400 placeholder image"
            />
          </Carousel.Slide>
        ))}
      </Carousel.Viewport>
      <Carousel.PreviousTrigger aria-label="Previous">
        {"<"}
      </Carousel.PreviousTrigger>
      <Carousel.Indicators label="Choose slide" />
      <Carousel.NextTrigger aria-label="Next">{">"}</Carousel.NextTrigger>
    </Carousel.Root>
  );
}
