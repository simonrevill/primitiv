import { Carousel } from "@primitiv/react";

import { carouselImages } from "../fixtures";
import "./_coverFlow.scss";

/**
 * Cover Flow — slides fan out with a 3D perspective rotation as they
 * scroll off-centre, like the classic iTunes/iOS cover browser.
 *
 * JS owns: `snapAlign="center"` (programmatic navigation passes
 *   `inline: "center"` to scrollIntoView; CSS snap engine corrects).
 * CSS owns: scroll-driven animation via `animation-timeline: view(inline)`.
 *   Each slide animates from a tilted-right entry → flat centre → tilted-left
 *   exit driven purely by its scroll position in the viewport — no JS
 *   frame computation, no resize observers. `perspective()` inside the
 *   transform function works inside an overflow:auto container (avoids the
 *   stacking-context clipping issue that `perspective` as a property causes).
 */
export function CoverFlow() {
  return (
    <Carousel.Root
      className="cover-flow"
      ariaLabel="Metal primitives — cover flow"
      snapAlign="center"
    >
      <Carousel.Viewport className="cover-flow__viewport">
        {carouselImages.map(({ src, description }) => (
          <Carousel.Slide key={src} className="cover-flow__slide">
            <img
              className="cover-flow__image"
              src={src}
              alt={description}
            />
          </Carousel.Slide>
        ))}
      </Carousel.Viewport>
      <div className="cover-flow__controls">
        <Carousel.PreviousTrigger
          className="cover-flow__trigger"
          aria-label="Previous"
        >
          {"<"}
        </Carousel.PreviousTrigger>
        <Carousel.Indicators
          className="cover-flow__indicator-group"
          label="Choose slide"
        />
        <Carousel.NextTrigger
          className="cover-flow__trigger"
          aria-label="Next"
        >
          {">"}
        </Carousel.NextTrigger>
      </div>
    </Carousel.Root>
  );
}
