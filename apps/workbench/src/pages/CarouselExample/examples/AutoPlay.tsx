import { Carousel } from "@primitiv/react";

import { carouselImages } from "../fixtures";
import "./_autoPlay.scss";

/**
 * Autoplay — slides advance automatically every 3 seconds, pausing
 * automatically while the user hovers or focuses any part of the
 * carousel (WCAG 2.2.2). The PlayPauseTrigger lets the user manually
 * toggle without the hover-pause overriding their choice.
 *
 * JS owns: `autoplay={{ delay: 3000 }}` (timer managed by Carousel.Root),
 *   `defaultPlaying` (starts playing on mount).
 * CSS owns: same single-slide-scroll layout; the progress bar uses a
 *   CSS transition on `--progress` so it animates smoothly.
 */
export function AutoPlay() {
  return (
    <Carousel.Root
      className="autoplay"
      ariaLabel="Metal primitives — autoplay"
      autoplay={{ delay: 3000 }}
      defaultPlaying
    >
      <Carousel.Viewport className="autoplay__viewport">
        {carouselImages.map(({ src, description }) => (
          <Carousel.Slide key={src} className="autoplay__slide">
            <img
              className="autoplay__image"
              src={src}
              alt={description}
            />
          </Carousel.Slide>
        ))}
      </Carousel.Viewport>
      <div className="autoplay__controls">
        <Carousel.PreviousTrigger
          className="autoplay__trigger"
          aria-label="Previous"
        >
          {"<"}
        </Carousel.PreviousTrigger>
        <Carousel.PlayPauseTrigger className="autoplay__playpause">
          {({ playing }) => (playing ? "Pause" : "Play")}
        </Carousel.PlayPauseTrigger>
        <Carousel.Indicators
          className="autoplay__indicator-group"
          label="Choose slide"
        />
        <Carousel.NextTrigger
          className="autoplay__trigger"
          aria-label="Next"
        >
          {">"}
        </Carousel.NextTrigger>
      </div>
    </Carousel.Root>
  );
}
