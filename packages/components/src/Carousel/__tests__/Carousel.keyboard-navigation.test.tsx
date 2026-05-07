import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Carousel } from "..";

describe("Carousel keyboard navigation", () => {
  it("should advance the active page when ArrowRight is pressed with the viewport focused", async () => {
    const user = userEvent.setup();
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    // Tab into the carousel — the Viewport must be in the tab order so
    // keyboard users can reach the rotation control without first
    // tabbing through every slide's interactive content.
    await user.tab();
    expect(screen.getByTestId("viewport")).toHaveFocus();

    await user.keyboard("{ArrowRight}");

    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should retreat the active page when ArrowLeft is pressed with the viewport focused", async () => {
    const user = userEvent.setup();
    render(
      <Carousel.Root ariaLabel="Featured products" defaultPage={2}>
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    await user.tab();
    await user.keyboard("{ArrowLeft}");

    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should jump to the first page when Home is pressed with the viewport focused", async () => {
    const user = userEvent.setup();
    render(
      <Carousel.Root ariaLabel="Featured products" defaultPage={2}>
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    await user.tab();
    await user.keyboard("{Home}");

    expect(screen.getByTestId("slide-0")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should jump to the last page when End is pressed with the viewport focused", async () => {
    const user = userEvent.setup();
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    await user.tab();
    await user.keyboard("{End}");

    expect(screen.getByTestId("slide-2")).toHaveAttribute(
      "data-state",
      "active",
    );
  });
});
