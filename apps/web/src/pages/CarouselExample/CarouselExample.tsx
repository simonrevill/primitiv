import { Carousel, Tabs } from "@primitiv/react";

import { carouselImages } from "./fixtures";
import "./CarouselExample.scss";

export function CarouselExample() {
  return (
    <div className="carousel-example">
      <Tabs.Root defaultValue="single-slide-scroll">
        <Tabs.List
          className="carousel-example__tabs"
          label="Carousel examples"
        >
          <Tabs.Trigger
            className="carousel-example__tab"
            value="single-slide-scroll"
          >
            Single · Slide
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          className="carousel-example__panel"
          value="single-slide-scroll"
        >
          <Carousel.Root
            className="carousel carousel--debug"
            ariaLabel="Metal Primitives"
            loop
            snapAlign="center"
          >
            <Carousel.Viewport className="carousel__viewport">
              {carouselImages.map(({ src, description }) => (
                <Carousel.Slide key={src} className="carousel__slide">
                  <img className="carousel__image" src={src} alt={description} />
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
              <Carousel.NextTrigger
                className="carousel__trigger"
                aria-label="Next"
              >
                {">"}
              </Carousel.NextTrigger>
            </div>
          </Carousel.Root>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
