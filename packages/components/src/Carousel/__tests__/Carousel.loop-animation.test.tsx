import { render } from "@testing-library/react";

import { Carousel } from "..";

function renderWithSlides(
  rootProps: Omit<
    React.ComponentProps<typeof Carousel.Root>,
    "ariaLabel" | "children"
  > & { ariaLabel?: string } = {},
  count = 3,
) {
  return render(
    <Carousel.Root ariaLabel="Featured products" {...rootProps}>
      <Carousel.Viewport data-testid="viewport">
        {Array.from({ length: count }).map((_, i) => (
          <Carousel.Slide key={i} data-testid={`slide-${i}`} />
        ))}
      </Carousel.Viewport>
    </Carousel.Root>,
  );
}

describe("Carousel loop wrap clones", () => {
  it("should render a leading and a trailing clone of slide content when loop=true", () => {
    const { container } = renderWithSlides({ loop: true });

    const leading = container.querySelector(
      '[data-carousel-slide-clone="leading"]',
    );
    const trailing = container.querySelector(
      '[data-carousel-slide-clone="trailing"]',
    );

    expect(leading).not.toBeNull();
    expect(trailing).not.toBeNull();
    expect(leading).toHaveAttribute("aria-hidden", "true");
    expect(trailing).toHaveAttribute("aria-hidden", "true");
  });

  it("should not render clones when transition='none' (consumer owns the visual)", () => {
    const { container } = renderWithSlides({ loop: true, transition: "none" });

    expect(
      container.querySelector("[data-carousel-slide-clone]"),
    ).toBeNull();
  });

  it("should not render clones when there is only one slide (nothing to wrap to)", () => {
    const { container } = renderWithSlides({ loop: true }, 1);

    expect(
      container.querySelector("[data-carousel-slide-clone]"),
    ).toBeNull();
  });

  it("should render slidesPerPage clones at each end so the wrap scroll has a full visible window to land on", () => {
    const { container } = renderWithSlides(
      { loop: true, slidesPerPage: 2 },
      4,
    );

    expect(
      container.querySelectorAll('[data-carousel-slide-clone="leading"]'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-carousel-slide-clone="trailing"]'),
    ).toHaveLength(2);
  });
});
