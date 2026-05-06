import { Carousel } from "@primitiv/components";

import "./CarouselExample.scss";

export function CarouselExample() {
  return (
    <Carousel.Root
      className="carousel"
      ariaLabel="Featured products"
      slidesPerPage={3}
      loop
    >
      <Carousel.Viewport className="carousel__viewport">
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <Carousel.Slide key={item} className="carousel__slide">
            <img
              className="carousel__image"
              src={`https://placehold.co/600x400@2x.png/?text=Slide+${index + 1}`}
              alt="600 x 400 placeholder image"
            />
          </Carousel.Slide>
        ))}
      </Carousel.Viewport>
      <Carousel.PreviousTrigger
        className="carousel__trigger"
        aria-label="Previous"
      >
        {"<"}
      </Carousel.PreviousTrigger>
      <Carousel.Indicators label="Choose slide" />
      <Carousel.NextTrigger className="carousel__trigger" aria-label="Next">
        {">"}
      </Carousel.NextTrigger>
    </Carousel.Root>
  );
}
