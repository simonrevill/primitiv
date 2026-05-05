import { useRef } from "react";
import { act, render, screen } from "@testing-library/react";

import { Carousel } from "..";
import type { CarouselImperativeApi } from "..";
import { MockIntersectionObserver } from "../../test/intersectionObserverPolyfill";

describe("Carousel IntersectionObserver fallback + isInView", () => {
  it("isInView(slideIndex) should reflect the observer's last reported intersection state", () => {
    const ref = { current: null } as React.RefObject<CarouselImperativeApi>;
    render(
      <Carousel.Root ref={ref} ariaLabel="Featured products">
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    expect(ref.current!.isInView(0)).toBe(false);
    expect(ref.current!.isInView(1)).toBe(false);

    const io = MockIntersectionObserver.latest!;
    act(() => {
      io.fire([
        {
          target: screen.getByTestId("slide-0"),
          isIntersecting: true,
          intersectionRatio: 1,
        },
        {
          target: screen.getByTestId("slide-1"),
          isIntersecting: false,
          intersectionRatio: 0,
        },
      ]);
    });

    expect(ref.current!.isInView(0)).toBe(true);
    expect(ref.current!.isInView(1)).toBe(false);
  });

  it("should drive currentPage from IO entries crossing the 0.6 threshold", () => {
    function Parent() {
      const ref = useRef<CarouselImperativeApi>(null);
      return (
        <Carousel.Root ref={ref} ariaLabel="Featured products">
          <Carousel.Viewport>
            <Carousel.Slide data-testid="slide-0" />
            <Carousel.Slide data-testid="slide-1" />
            <Carousel.Slide data-testid="slide-2" />
          </Carousel.Viewport>
        </Carousel.Root>
      );
    }

    render(<Parent />);

    const io = MockIntersectionObserver.latest!;
    act(() => {
      io.fire([
        {
          target: screen.getByTestId("slide-0"),
          isIntersecting: false,
          intersectionRatio: 0.1,
        },
        {
          target: screen.getByTestId("slide-2"),
          isIntersecting: true,
          intersectionRatio: 0.9,
        },
      ]);
    });

    expect(screen.getByTestId("slide-2")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should derive the page index from floor(slideIndex / slidesPerPage) when slidesPerPage > 1", () => {
    render(
      <Carousel.Root ariaLabel="Featured products" slidesPerPage={2}>
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
          <Carousel.Slide data-testid="slide-3" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    const io = MockIntersectionObserver.latest!;
    act(() => {
      io.fire([
        {
          target: screen.getByTestId("slide-3"),
          isIntersecting: true,
          intersectionRatio: 0.8,
        },
      ]);
    });

    // floor(3 / 2) = page 1; slides 2 and 3 active.
    expect(screen.getByTestId("slide-2")).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(screen.getByTestId("slide-3")).toHaveAttribute(
      "data-state",
      "active",
    );
  });
});
