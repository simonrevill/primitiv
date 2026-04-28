import { render, screen } from "@testing-library/react";

import { Carousel } from "..";

describe("Carousel basic rendering tests", () => {
  describe("Carousel.Root", () => {
    it("should render the Carousel.Root component", () => {
      render(
        <Carousel.Root ariaLabel="Featured products" data-testid="carousel-root" />,
      );
      const carouselRoot = screen.getByTestId("carousel-root");

      expect(carouselRoot).toBeVisible();
    });

    it('should apply aria-roledescription="carousel" so assistive tech announces the widget as a carousel', () => {
      render(
        <Carousel.Root ariaLabel="Featured products" data-testid="carousel-root" />,
      );
      const carouselRoot = screen.getByTestId("carousel-root");

      expect(carouselRoot).toHaveAttribute("aria-roledescription", "carousel");
    });

    it("should expose the required ariaLabel prop as aria-label on the rendered element", () => {
      const label = "Featured products";
      render(<Carousel.Root ariaLabel={label} data-testid="carousel-root" />);
      const carouselRoot = screen.getByTestId("carousel-root");

      expect(carouselRoot).toHaveAttribute("aria-label", label);
    });

    it("should accept ariaLabelledBy as an alternative to ariaLabel", () => {
      const labelId = "carousel-heading";
      render(
        <>
          <h2 id={labelId}>Featured products</h2>
          <Carousel.Root ariaLabelledBy={labelId} data-testid="carousel-root" />
        </>,
      );
      const carouselRoot = screen.getByTestId("carousel-root");

      expect(carouselRoot).toHaveAttribute("aria-labelledby", labelId);
    });

    it("should render as a <section> element by default to match the WAI-ARIA carousel pattern", () => {
      render(
        <Carousel.Root ariaLabel="Featured products" data-testid="carousel-root" />,
      );
      const carouselRoot = screen.getByTestId("carousel-root");

      expect(carouselRoot.tagName).toBe("SECTION");
    });

    it("should accept a className prop", () => {
      const testClass = "custom-carousel-root";
      render(
        <Carousel.Root
          ariaLabel="Featured products"
          className={testClass}
          data-testid="carousel-root"
        />,
      );
      const carouselRoot = screen.getByTestId("carousel-root");

      expect(carouselRoot).toHaveAttribute("class", testClass);
    });

    it("should apply a className of empty string by default when not specified", () => {
      render(
        <Carousel.Root ariaLabel="Featured products" data-testid="carousel-root" />,
      );
      const carouselRoot = screen.getByTestId("carousel-root");

      expect(carouselRoot).toHaveAttribute("class", "");
    });

    it("should render children inside Carousel.Root", () => {
      render(
        <Carousel.Root ariaLabel="Featured products">
          <p>Carousel body</p>
        </Carousel.Root>,
      );

      expect(screen.getByText("Carousel body")).toBeVisible();
    });
  });
});
