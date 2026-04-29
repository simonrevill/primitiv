import { act, fireEvent, render, screen } from "@testing-library/react";

import { Carousel } from "..";

describe("Carousel autoplay timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should advance the active page after 4000ms when autoplay={true} and playing is true", () => {
    render(
      <Carousel.Root ariaLabel="Featured products" autoplay defaultPlaying>
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should accept a custom delay via autoplay={{ delay: 1000 }}", () => {
    render(
      <Carousel.Root
        ariaLabel="Featured products"
        autoplay={{ delay: 1000 }}
        defaultPlaying
      >
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(screen.getByTestId("slide-0")).toHaveAttribute(
      "data-state",
      "active",
    );

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should react to autoplay being toggled on at runtime via re-render", () => {
    const { rerender } = render(
      <Carousel.Root
        ariaLabel="Featured products"
        autoplay={false}
        defaultPlaying
      >
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByTestId("slide-0")).toHaveAttribute(
      "data-state",
      "active",
    );

    rerender(
      <Carousel.Root ariaLabel="Featured products" autoplay defaultPlaying>
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should not advance when autoplay is enabled but playing flips on later via parent state", () => {
    function Parent({ playing }: { playing: boolean }) {
      return (
        <Carousel.Root
          ariaLabel="Featured products"
          autoplay
          playing={playing}
          onPlayingChange={() => {}}
        >
          <Carousel.Viewport>
            <Carousel.Slide data-testid="slide-0" />
            <Carousel.Slide data-testid="slide-1" />
          </Carousel.Viewport>
        </Carousel.Root>
      );
    }

    const { rerender } = render(<Parent playing={false} />);

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByTestId("slide-0")).toHaveAttribute(
      "data-state",
      "active",
    );

    rerender(<Parent playing={true} />);

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should advance repeatedly across multiple delay intervals", () => {
    render(
      <Carousel.Root ariaLabel="Featured products" autoplay defaultPlaying>
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByTestId("slide-2")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should stop advancing once the active page reaches the last slide when loop is false", () => {
    render(
      <Carousel.Root
        ariaLabel="Featured products"
        autoplay
        defaultPlaying
        defaultPage={0}
      >
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );

    // Already at last; further ticks are no-ops.
    act(() => {
      vi.advanceTimersByTime(20_000);
    });
    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should wrap around when loop is true", () => {
    render(
      <Carousel.Root
        ariaLabel="Featured products"
        autoplay
        defaultPlaying
        loop
        defaultPage={1}
      >
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
        </Carousel.Viewport>
      </Carousel.Root>,
    );

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.getByTestId("slide-0")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should stop the timer when playing flips to false", () => {
    render(
      <Carousel.Root ariaLabel="Featured products" autoplay defaultPlaying>
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
        <Carousel.PlayPauseTrigger />
      </Carousel.Root>,
    );

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );

    // User pauses via the play/pause trigger — timer must not fire any
    // further ticks. fireEvent is used here because userEvent's async
    // machinery interacts poorly with vitest fake timers.
    act(() => {
      fireEvent.click(screen.getByRole("button"));
    });

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );
  });
});
