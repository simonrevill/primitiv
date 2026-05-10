import { Tabs } from "@primitiv/react";

import { SingleSlideScroll } from "./examples";
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
          <SingleSlideScroll />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
