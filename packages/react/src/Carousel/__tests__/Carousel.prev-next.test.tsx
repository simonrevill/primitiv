import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
      <Carousel.Viewport>
        {Array.from({ length: count }).map((_, i) => (
          <Carousel.Slide key={i} data-testid={`slide-${i}`} />
        ))}
      </Carousel.Viewport>
      <Carousel.PreviousTrigger>Previous</Carousel.PreviousTrigger>
      <Carousel.NextTrigger>Next</Carousel.NextTrigger>
    </Carousel.Root>,
  );
}

describe("Carousel boundary behaviour with loop=false (default)", () => {
  it("should disable Carousel.PreviousTrigger when the active page is the first slide", () => {
    renderWithSlides();

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });

  it("should disable Carousel.NextTrigger when the active page is the last slide", () => {
    renderWithSlides({ defaultPage: 2 });

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("should leave triggers enabled in the middle of the range, then disable Next once the user reaches the last slide", async () => {
    const user = userEvent.setup();
    renderWithSlides({ defaultPage: 1 });

    // Middle: neither trigger disabled.
    expect(screen.getByRole("button", { name: "Previous" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).not.toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Next" }));

    // After advancing to the last slide, Next must clamp.
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("should explicitly accept loop={false} (matching the default)", () => {
    renderWithSlides({ loop: false });

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });

  it("should disable both triggers when there are no slides registered", () => {
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.PreviousTrigger>Previous</Carousel.PreviousTrigger>
        <Carousel.NextTrigger>Next</Carousel.NextTrigger>
      </Carousel.Root>,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("should disable both triggers when only one slide is registered", () => {
    renderWithSlides({}, 1);

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});

describe("Carousel boundary behaviour with loop=true", () => {
  it("should wrap to the last slide when Carousel.PreviousTrigger is clicked at the first slide", async () => {
    const user = userEvent.setup();
    renderWithSlides({ loop: true });

    await user.click(screen.getByRole("button", { name: "Previous" }));

    expect(screen.getByTestId("slide-2")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should wrap to the first slide when Carousel.NextTrigger is clicked at the last slide", async () => {
    const user = userEvent.setup();
    renderWithSlides({ loop: true, defaultPage: 2 });

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByTestId("slide-0")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should call onPageChange with the wrapped target page in controlled mode", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    function Parent() {
      const [page, setPage] = useState(0);
      return (
        <Carousel.Root
          ariaLabel="Featured products"
          loop
          page={page}
          onPageChange={(next) => {
            onPageChange(next);
            setPage(next);
          }}
        >
          <Carousel.Viewport>
            <Carousel.Slide data-testid="slide-0" />
            <Carousel.Slide data-testid="slide-1" />
            <Carousel.Slide data-testid="slide-2" />
          </Carousel.Viewport>
          <Carousel.PreviousTrigger>Previous</Carousel.PreviousTrigger>
          <Carousel.NextTrigger>Next</Carousel.NextTrigger>
        </Carousel.Root>
      );
    }

    render(<Parent />);

    await user.click(screen.getByRole("button", { name: "Previous" }));

    expect(onPageChange).toHaveBeenLastCalledWith(2);
    expect(screen.getByTestId("slide-2")).toHaveAttribute(
      "data-state",
      "active",
    );
  });
});
