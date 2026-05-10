import { Carousel } from "@primitiv/react";
import "./CarouselExample.scss";

export function CarouselExample() {
  const images = [
    {
      name: "Cube (Damascus Steel)",
      src: "/cube.png",
      description:
        "A precision-machined Damascus steel cube with an etched compass rose, set on a carved granite pedestal.",
    },
    {
      name: "Sphere (Patinated Bronze)",
      src: "/sphere.png",
      description:
        "A hammered bronze sphere with an etched gear symbol, resting on a heavy, rune-carved bronze pedestal.",
    },
    {
      name: "Cylinder (Blued Titanium)",
      src: "/cylinder.png",
      description:
        "A polished titanium cylinder with an etched circuit board pattern, sitting on an iridescent glass base in front of architectural models.",
    },
    {
      name: "Cone (Stainless Steel & Brass)",
      src: "/cone.png",
      description:
        "A multi-metal segmented cone with astronomical symbols, displayed next to miniature armillary spheres.",
    },
    {
      name: "Torus (Damascus & Clockwork)",
      src: "/torus.png",
      description:
        "A complex Damascus steel torus with internal moving clockwork and a compass rose, on a unique ebony-wood sound-wave pedestal.",
    },
    {
      name: "Wedge (Verdigris Copper)",
      src: "/wedge.png",
      description:
        "A weathered copper wedge with etched architectural glyphs and a hammer-and-chisel motif, on a pedestal of petrified wood and gears.",
    },
    {
      name: "Pyramid (Multi-Metal Filigree)",
      src: "/pyramid.png",
      description:
        "A gold and silver filigree pyramid with astronomical details, featured alongside miniature temple models.",
    },
  ];

  return (
    <Carousel.Root
      className="carousel carousel--debug"
      ariaLabel="Metal Primitives"
      loop
      snapAlign="center"
    >
      <Carousel.Viewport className="carousel__viewport">
        {images.map(({ src, description }) => (
          <Carousel.Slide key={src} className="carousel__slide">
            <img className="carousel__image" src={src} alt={description} />
          </Carousel.Slide>
        ))}
      </Carousel.Viewport>
      <div className="carousel__controls">
        <Carousel.PreviousTrigger
          className="carousel__trigger"
          aria-label="Previous"
        >
          {"<"}
        </Carousel.PreviousTrigger>
        <Carousel.Indicators
          label="Choose slide"
          className="carousel__indicator-group"
        />
        <Carousel.NextTrigger className="carousel__trigger" aria-label="Next">
          {">"}
        </Carousel.NextTrigger>
      </div>
    </Carousel.Root>
  );
}
