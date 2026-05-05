import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Carousel } from "..";

function mockRect(element: Element, left: number) {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    left,
    top: 0,
    right: left + 300,
    bottom: 100,
    width: 300,
    height: 100,
    x: left,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
}

function fireScrollSnapChange(viewport: HTMLElement, snapTarget: HTMLElement) {
  const event = new Event("scrollsnapchange", { bubbles: false });
  Object.defineProperty(event, "snapTargetInline", {
    value: snapTarget,
    writable: false,
  });
  act(() => {
    viewport.dispatchEvent(event);
  });
}

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

describe("Carousel loop wrap forward scroll", () => {
  it("should smooth-scroll to the trailing clone position when next() wraps from the last page", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Carousel.Root ariaLabel="Featured products" loop defaultPage={2}>
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
        <Carousel.NextTrigger>Next</Carousel.NextTrigger>
      </Carousel.Root>,
    );

    const viewport = screen.getByTestId("viewport");
    viewport.scrollLeft = 200;

    // Real slides — these are NOT what the wrap should scroll to. Slide-0
    // sits to the left of the current position, so a regular scroll
    // would aim for the negative side and yield left=0 (the current bug).
    mockRect(viewport, 0);
    mockRect(screen.getByTestId("slide-0"), -200);
    mockRect(screen.getByTestId("slide-1"), -100);
    mockRect(screen.getByTestId("slide-2"), 0);

    // Trailing clone is positioned just to the right of slide-2, exactly
    // where slide-0 would visually appear if we wrapped forward without
    // a long backwards scroll.
    const trailing = container.querySelector(
      '[data-carousel-slide-clone="trailing"]',
    )!;
    mockRect(trailing, 300);

    const scrollToSpy = vi.spyOn(viewport, "scrollTo");

    await user.click(screen.getByRole("button", { name: "Next" }));

    // target = scrollLeft (200) + (clone.left (300) - viewport.left (0))
    //        = 500. Crucially NOT 0, which is what the regular scroll
    //        path produces and which causes the long backwards scroll.
    expect(scrollToSpy).toHaveBeenCalledWith({
      left: 500,
      behavior: "smooth",
    });
  });

  it("should instant-jump to the real slide-0 position once the smooth wrap scroll settles", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Carousel.Root ariaLabel="Featured products" loop defaultPage={2}>
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
        <Carousel.NextTrigger>Next</Carousel.NextTrigger>
      </Carousel.Root>,
    );

    const viewport = screen.getByTestId("viewport");
    viewport.scrollLeft = 200;

    mockRect(viewport, 0);
    mockRect(screen.getByTestId("slide-0"), -200);
    mockRect(screen.getByTestId("slide-1"), -100);
    mockRect(screen.getByTestId("slide-2"), 0);
    mockRect(
      container.querySelector('[data-carousel-slide-clone="trailing"]')!,
      300,
    );

    const scrollToSpy = vi.spyOn(viewport, "scrollTo");

    await user.click(screen.getByRole("button", { name: "Next" }));

    // Browser fires scrollend when the smooth animation finishes; the
    // viewport's clean-up path uses it to silently snap from the clone
    // to the real slide-0 so the user's view matches React state.
    act(() => {
      viewport.dispatchEvent(new Event("scrollend"));
    });

    // target = scrollLeft (200) + (slide-0.left (-200) - viewport.left (0))
    //        = 0. Instant so the snap is invisible — the user just sees
    //        slide-0 sitting at its real position after the smooth scroll
    //        completed.
    expect(scrollToSpy).toHaveBeenCalledWith({
      left: 0,
      behavior: "instant",
    });
  });
});

describe("Carousel loop wrap backward scroll", () => {
  it("should smooth-scroll to the leading clone, then instant-snap to real slide-N when previous() wraps from the first page", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Carousel.Root ariaLabel="Featured products" loop>
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
        <Carousel.PreviousTrigger>Previous</Carousel.PreviousTrigger>
      </Carousel.Root>,
    );

    const viewport = screen.getByTestId("viewport");
    viewport.scrollLeft = 0;

    mockRect(viewport, 0);
    // Real slide-2 is the wrap target; sits to the right of the
    // current viewport position, so a regular wrap would scroll
    // forwards — wrong direction for "previous".
    mockRect(screen.getByTestId("slide-0"), 0);
    mockRect(screen.getByTestId("slide-1"), 100);
    mockRect(screen.getByTestId("slide-2"), 200);
    // Leading clone sits to the LEFT of slide-0, exactly where slide-N
    // would visually appear if we wrapped backward from slide-0.
    mockRect(
      container.querySelector('[data-carousel-slide-clone="leading"]')!,
      -300,
    );

    const scrollToSpy = vi.spyOn(viewport, "scrollTo");

    await user.click(screen.getByRole("button", { name: "Previous" }));

    // Smooth scroll to leading clone position:
    // target = scrollLeft (0) + (clone.left (-300) - viewport.left (0)) = -300.
    expect(scrollToSpy).toHaveBeenCalledWith({
      left: -300,
      behavior: "smooth",
    });

    act(() => {
      viewport.dispatchEvent(new Event("scrollend"));
    });

    // Instant snap to real slide-2:
    // target = scrollLeft (0) + (slide-2.left (200) - viewport.left (0)) = 200.
    expect(scrollToSpy).toHaveBeenCalledWith({
      left: 200,
      behavior: "instant",
    });
  });
});

describe("Carousel loop wrap manual swipe onto a clone", () => {
  it("should advance to page 0 and instant-snap to real slide-0 when the user swipes past slide-N onto the trailing clone", () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Carousel.Root
        ariaLabel="Featured products"
        loop
        page={2}
        onPageChange={onPageChange}
      >
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    const viewport = screen.getByTestId("viewport");
    viewport.scrollLeft = 600;
    mockRect(viewport, 0);
    mockRect(screen.getByTestId("slide-0"), -600);
    mockRect(screen.getByTestId("slide-1"), -300);
    mockRect(screen.getByTestId("slide-2"), 0);
    const trailing = container.querySelector(
      '[data-carousel-slide-clone="trailing"]',
    )! as HTMLElement;
    mockRect(trailing, 300);

    const scrollToSpy = vi.spyOn(viewport, "scrollTo");

    // The browser's CSS scroll-snap landed the user on the trailing
    // clone after they swiped past slide-2.
    fireScrollSnapChange(viewport, trailing);

    expect(onPageChange).toHaveBeenCalledWith(0);
    // Re-anchor: target = scrollLeft (600) + (slide-0.left (-600) - viewport.left (0)) = 0.
    expect(scrollToSpy).toHaveBeenCalledWith({
      left: 0,
      behavior: "instant",
    });
  });

  it("should retreat to the last page and instant-snap to real slide-N when the user swipes before slide-0 onto the leading clone", () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Carousel.Root
        ariaLabel="Featured products"
        loop
        page={0}
        onPageChange={onPageChange}
      >
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    const viewport = screen.getByTestId("viewport");
    viewport.scrollLeft = 0;
    mockRect(viewport, 0);
    mockRect(screen.getByTestId("slide-0"), 0);
    mockRect(screen.getByTestId("slide-1"), 100);
    mockRect(screen.getByTestId("slide-2"), 200);
    const leading = container.querySelector(
      '[data-carousel-slide-clone="leading"]',
    )! as HTMLElement;
    mockRect(leading, -300);

    const scrollToSpy = vi.spyOn(viewport, "scrollTo");

    fireScrollSnapChange(viewport, leading);

    expect(onPageChange).toHaveBeenCalledWith(2);
    // Re-anchor: target = scrollLeft (0) + (slide-2.left (200) - viewport.left (0)) = 200.
    expect(scrollToSpy).toHaveBeenCalledWith({
      left: 200,
      behavior: "instant",
    });
  });
});
