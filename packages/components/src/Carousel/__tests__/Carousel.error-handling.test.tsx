import { render } from "@testing-library/react";

import { Carousel } from "..";

describe("Carousel error handling", () => {
  it("should throw when Carousel.PlayPauseTrigger is rendered without autoplay enabled on Carousel.Root", () => {
    expect(() => {
      render(
        <Carousel.Root ariaLabel="Featured products">
          <Carousel.PlayPauseTrigger />
        </Carousel.Root>,
      );
    }).toThrow(
      "Carousel.PlayPauseTrigger requires autoplay to be enabled on Carousel.Root",
    );
  });

  it("should throw when Carousel.PlayPauseTrigger is rendered with autoplay={false}", () => {
    expect(() => {
      render(
        <Carousel.Root ariaLabel="Featured products" autoplay={false}>
          <Carousel.PlayPauseTrigger />
        </Carousel.Root>,
      );
    }).toThrow(
      "Carousel.PlayPauseTrigger requires autoplay to be enabled on Carousel.Root",
    );
  });

});
