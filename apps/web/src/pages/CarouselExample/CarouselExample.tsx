import { Carousel } from "@primitiv/components";

import "./CarouselExample.scss";

export function CarouselExample() {
  return (
    <Carousel.Root className="carousel" ariaLabel="Featured products" loop>
      <Carousel.Viewport className="carousel__viewport">
        {[
          { src: "/cube.png" },
          { src: "/sphere.png" },
          { src: "/cylinder.png" },
          { src: "/cone.png" },
          { src: "/torus.png" },
          { src: "/wedge.png" },
          { src: "/pyramid.png" },
        ].map(({ src }) => (
          <Carousel.Slide key={src} className="carousel__slide">
            <img
              className="carousel__image"
              src={src}
              alt="600 x 400 placeholder image"
            />
          </Carousel.Slide>
        ))}
      </Carousel.Viewport>
      <div className="carousel__controls">
        <Carousel.PreviousTrigger
          className="carousel__trigger"
          aria-label="Previous"
        >
          {"<"}
        </Carousel.PreviousTrigger>
        <Carousel.Indicators
          label="Choose slide"
          className="carousel__indicator-group"
        />
        <Carousel.NextTrigger className="carousel__trigger" aria-label="Next">
          {">"}
        </Carousel.NextTrigger>
      </div>
    </Carousel.Root>
  );
}
