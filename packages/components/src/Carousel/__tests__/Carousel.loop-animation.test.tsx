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
});
