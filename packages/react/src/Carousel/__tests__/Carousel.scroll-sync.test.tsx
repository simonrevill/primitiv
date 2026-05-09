import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Carousel } from "..";

function mockSlideOffsets(slides: Record<string, number>, viewportLeft = 0) {
  Object.entries(slides).forEach(([testId, left]) => {
    vi.spyOn(
      screen.getByTestId(testId),
      "getBoundingClientRect",
    ).mockReturnValue({
      left,
      top: 0,
      right: left + 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: left,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
  });
  vi.spyOn(
    screen.getByTestId("viewport"),
    "getBoundingClientRect",
  ).mockReturnValue({
    left: viewportLeft,
    top: 0,
    right: viewportLeft + 300,
    bottom: 100,
    width: 300,
    height: 100,
    x: viewportLeft,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
}

describe("Carousel scroll sync (programmatic page change)", () => {
  it("should call scrollTo on the Viewport when the active page changes", async () => {
    const user = userEvent.setup();
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
        </Carousel.Viewport>
        <Carousel.NextTrigger>Next</Carousel.NextTrigger>
      </Carousel.Root>,
    );

    const viewport = screen.getByTestId("viewport");
    mockSlideOffsets({ "slide-0": 0, "slide-1": 200 });
    const scrollToSpy = vi.spyOn(viewport, "scrollTo");

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(scrollToSpy).toHaveBeenCalled();
  });

  it("should derive the scroll target from the bounding rect of the first slide on the target page", async () => {
    const user = userEvent.setup();
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
        <Carousel.IndicatorGroup label="Choose">
          <Carousel.Indicator index={0} />
          <Carousel.Indicator index={1} />
          <Carousel.Indicator index={2} />
        </Carousel.IndicatorGroup>
      </Carousel.Root>,
    );

    const viewport = screen.getByTestId("viewport");
    mockSlideOffsets({ "slide-0": 0, "slide-1": 200, "slide-2": 400 });
    viewport.scrollLeft = 0;
    const scrollToSpy = vi.spyOn(viewport, "scrollTo");

    await user.click(screen.getByRole("button", { name: "Slide 3" }));

    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 400, behavior: "smooth" }),
    );
  });

  it("should derive the scroll target from the first slide of a multi-slide page", async () => {
    const user = userEvent.setup();
    render(
      <Carousel.Root ariaLabel="Featured products" slidesPerPage={2}>
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
          <Carousel.Slide data-testid="slide-3" />
        </Carousel.Viewport>
        <Carousel.NextTrigger>Next</Carousel.NextTrigger>
      </Carousel.Root>,
    );

    const viewport = screen.getByTestId("viewport");
    mockSlideOffsets({
      "slide-0": 0,
      "slide-1": 200,
      "slide-2": 400,
      "slide-3": 600,
    });
    viewport.scrollLeft = 0;
    const scrollToSpy = vi.spyOn(viewport, "scrollTo");

    // Page 0 → page 1 means first visible slide becomes slide 2 (index = page * slidesPerPage).
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 400, behavior: "smooth" }),
    );
  });

  it("should account for the current scrollLeft when computing the target", async () => {
    const user = userEvent.setup();
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
        </Carousel.Viewport>
        <Carousel.NextTrigger>Next</Carousel.NextTrigger>
      </Carousel.Root>,
    );

    const viewport = screen.getByTestId("viewport");
    // Slide-1 is at left=50 in viewport coords because the viewport
    // has already scrolled 150px to the right.
    viewport.scrollLeft = 150;
    mockSlideOffsets({ "slide-0": -150, "slide-1": 50 });
    const scrollToSpy = vi.spyOn(viewport, "scrollTo");

    await user.click(screen.getByRole("button", { name: "Next" }));

    // Target absolute scrollLeft = 150 + (50 - 0) = 200.
    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 200, behavior: "smooth" }),
    );
  });

  it("should offset the scroll target by half the remaining viewport width when snapAlign is 'center'", async () => {
    const user = userEvent.setup();
    render(
      <Carousel.Root ariaLabel="Featured products" snapAlign="center">
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
        </Carousel.Viewport>
        <Carousel.NextTrigger>Next</Carousel.NextTrigger>
      </Carousel.Root>,
    );

    const viewport = screen.getByTestId("viewport");
    // viewport width=300, slide width=100 (mockSlideOffsets defaults)
    // centeringOffset = (300 - 100) / 2 = 100
    mockSlideOffsets({ "slide-0": 0, "slide-1": 300 });
    viewport.scrollLeft = 0;
    const scrollToSpy = vi.spyOn(viewport, "scrollTo");

    await user.click(screen.getByRole("button", { name: "Next" }));

    // "start" would scroll to 300; "center" subtracts 100 → 200
    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 200, behavior: "smooth" }),
    );
  });
});
