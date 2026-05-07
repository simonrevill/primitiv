import { act, fireEvent, render, screen } from "@testing-library/react";
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

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? matches : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("Carousel loop wrap respects prefers-reduced-motion", () => {
  afterEach(() => {
    // @ts-expect-error: restore by deletion so other suites get jsdom default.
    delete window.matchMedia;
  });

  it("should bypass the clone hop and scroll directly to real slide-0 on a forward wrap when prefers-reduced-motion is reduce", async () => {
    mockReducedMotion(true);
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

    // No clone hop — the animation would be instant either way, so the
    // round-trip clone→real snap adds nothing.
    expect(scrollToSpy).not.toHaveBeenCalledWith({
      left: 500,
      behavior: "instant",
    });
    // Instead, the wrap goes directly to real slide-0 with instant.
    expect(scrollToSpy).toHaveBeenCalledWith({
      left: 0,
      behavior: "instant",
    });
  });
});

describe("Carousel loop wrap edge cases", () => {
  it("should preserve non-slide children rendered inside the Viewport when injecting clones", () => {
    const { container } = render(
      <Carousel.Root ariaLabel="Featured products" loop>
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <span data-testid="non-slide">caption</span>
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    expect(screen.getByTestId("non-slide")).toHaveTextContent("caption");
    expect(
      container.querySelectorAll('[data-carousel-slide-clone]'),
    ).toHaveLength(2);
  });

  it("should ignore scrollsnapchange events whose snapTargetInline is missing", () => {
    const onPageChange = vi.fn();
    render(
      <Carousel.Root
        ariaLabel="Featured products"
        loop
        page={0}
        onPageChange={onPageChange}
      >
        <Carousel.Viewport data-testid="viewport">
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    const viewport = screen.getByTestId("viewport");
    const scrollToSpy = vi.spyOn(viewport, "scrollTo");

    // Some browsers fire scrollsnapchange with no snapTargetInline at
    // all (e.g. when the snap target is removed mid-animation). The
    // handler must bail without throwing.
    act(() => {
      viewport.dispatchEvent(new Event("scrollsnapchange"));
    });

    expect(onPageChange).not.toHaveBeenCalled();
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("should ignore a scrollsnapchange whose target is an edge clone while the carousel's own scroll-effect is still in flight", () => {
    // Regression: on initial mount with `loop`, the viewport renders with
    // the leading clone occupying scrollLeft=0 and the scroll-effect
    // immediately scrollTo's the active page's first slide. Some browsers
    // (and real-world reorderings between scrollend / scrollsnapchange)
    // surface that initial settling as a scrollsnapchange whose target IS
    // the leading clone. The handler must not interpret that as a user
    // wrap and fling the carousel to the last page.
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
    const leading = container.querySelector(
      '[data-carousel-slide-clone="leading"]',
    )! as HTMLElement;

    // The carousel's mount-time scrollTo is in flight (programmatic).
    // Browser fires scrollsnapchange with the leading clone target before
    // the smooth scroll has settled on slide-0.
    fireScrollSnapChange(viewport, leading);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should still scroll the viewport for the next page after a programmatic forward wrap whose smooth scroll lands the snap target on the trailing clone", async () => {
    // Regression: the smooth wrap into the trailing clone produces a
    // scrollsnapchange whose snapTargetInline IS the trailing clone — the
    // same shape as a user swiping past the last slide. The handler must
    // recognise this as the result of our own programmatic scroll (state
    // is already at the wrap target; the scrollend handler will silently
    // re-anchor) and not leave isUserScrollRef sticky-true. Otherwise the
    // very next NextTrigger click no-ops visually: indicators move to
    // page 1 but the viewport stays parked on slide-0.
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
    const trailing = container.querySelector(
      '[data-carousel-slide-clone="trailing"]',
    )! as HTMLElement;
    mockRect(trailing, 300);

    // Click Next on the last page — wraps forward through the trailing clone.
    await user.click(screen.getByRole("button", { name: "Next" }));

    // Browser CSS snap settled on the trailing clone at the end of the
    // smooth scroll. In real browsers this fires alongside scrollend.
    fireScrollSnapChange(viewport, trailing);
    act(() => {
      viewport.dispatchEvent(new Event("scrollend"));
    });

    // From here, the viewport is parked on real slide-0 and currentPage is 0.
    // Update mocks to reflect the post-wrap layout.
    mockRect(viewport, 0);
    mockRect(screen.getByTestId("slide-0"), 0);
    mockRect(screen.getByTestId("slide-1"), 100);
    mockRect(screen.getByTestId("slide-2"), 200);

    const scrollToSpy = vi.spyOn(viewport, "scrollTo");

    // Click Next again: page 0 → page 1. The viewport must scroll.
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 100, behavior: "smooth" }),
    );
  });

  it("should not double-fire the wrap re-anchor when scrollend AND the timeout fallback both trigger", () => {
    vi.useFakeTimers();
    try {
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

      // fireEvent stays synchronous so vi.useFakeTimers doesn't fight
      // userEvent's pointer-event scheduling.
      fireEvent.click(screen.getByRole("button", { name: "Next" }));

      // Real browsers fire scrollend AND the 600ms setTimeout fallback;
      // both call clearFlag, so the wrap re-anchor must only run once.
      act(() => {
        viewport.dispatchEvent(new Event("scrollend"));
      });
      act(() => {
        vi.advanceTimersByTime(600);
      });

      const instantCalls = scrollToSpy.mock.calls.filter(
        ([opts]) =>
          (opts as ScrollToOptions | undefined)?.behavior === "instant",
      );
      expect(instantCalls).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
