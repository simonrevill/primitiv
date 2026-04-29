import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Carousel } from "..";

describe("Carousel.IndicatorGroup", () => {
  it('should render with role="group"', () => {
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.IndicatorGroup label="Choose slide" />
      </Carousel.Root>,
    );

    expect(screen.getByRole("group", { name: "Choose slide" })).toBeVisible();
  });

  it("should accept a label that becomes the group's aria-label", () => {
    const groupLabel = "Choose slide";
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.IndicatorGroup label={groupLabel} />
      </Carousel.Root>,
    );

    expect(screen.getByRole("group", { name: groupLabel })).toHaveAttribute(
      "aria-label",
      groupLabel,
    );
  });

  it("should accept ariaLabelledBy that points at an external label element", () => {
    const labelId = "indicator-heading";
    render(
      <Carousel.Root ariaLabel="Featured products">
        <h3 id={labelId}>Choose slide</h3>
        <Carousel.IndicatorGroup ariaLabelledBy={labelId} />
      </Carousel.Root>,
    );

    expect(screen.getByRole("group", { name: "Choose slide" })).toHaveAttribute(
      "aria-labelledby",
      labelId,
    );
  });

  it("should accept a className prop", () => {
    const testClass = "custom-indicator-group";
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.IndicatorGroup label="Choose slide" className={testClass} />
      </Carousel.Root>,
    );

    expect(screen.getByRole("group", { name: "Choose slide" })).toHaveAttribute(
      "class",
      testClass,
    );
  });

  it("should apply a className of empty string by default when not specified", () => {
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.IndicatorGroup label="Choose slide" />
      </Carousel.Root>,
    );

    expect(screen.getByRole("group", { name: "Choose slide" })).toHaveAttribute(
      "class",
      "",
    );
  });

  it("should render children inside the group", () => {
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.IndicatorGroup label="Choose slide">
          <span>indicator-child</span>
        </Carousel.IndicatorGroup>
      </Carousel.Root>,
    );

    expect(screen.getByText("indicator-child")).toBeVisible();
  });
});

describe("Carousel.Indicator", () => {
  it('should render as <button type="button">', () => {
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.IndicatorGroup label="Choose slide">
          <Carousel.Indicator index={0} />
        </Carousel.IndicatorGroup>
      </Carousel.Root>,
    );

    const indicator = screen.getByRole("button", { name: "Slide 1" });
    expect(indicator).toBeVisible();
    expect(indicator).toHaveAttribute("type", "button");
  });

  it('should generate an aria-label of "Slide N" from the 1-indexed page position', () => {
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.IndicatorGroup label="Choose slide">
          <Carousel.Indicator index={0} />
          <Carousel.Indicator index={1} />
          <Carousel.Indicator index={2} />
        </Carousel.IndicatorGroup>
      </Carousel.Root>,
    );

    expect(screen.getByRole("button", { name: "Slide 1" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Slide 2" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Slide 3" })).toBeVisible();
  });

  it("should set a data-carousel-indicator attribute as a CSS-targeting hook", () => {
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.IndicatorGroup label="Choose slide">
          <Carousel.Indicator index={0} />
        </Carousel.IndicatorGroup>
      </Carousel.Root>,
    );

    expect(screen.getByRole("button", { name: "Slide 1" })).toHaveAttribute(
      "data-carousel-indicator",
      "",
    );
  });

  it("should accept a className prop", () => {
    const testClass = "custom-indicator";
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.IndicatorGroup label="Choose slide">
          <Carousel.Indicator index={0} className={testClass} />
        </Carousel.IndicatorGroup>
      </Carousel.Root>,
    );

    expect(screen.getByRole("button", { name: "Slide 1" })).toHaveAttribute(
      "class",
      testClass,
    );
  });

  it("should apply a className of empty string by default when not specified", () => {
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.IndicatorGroup label="Choose slide">
          <Carousel.Indicator index={0} />
        </Carousel.IndicatorGroup>
      </Carousel.Root>,
    );

    expect(screen.getByRole("button", { name: "Slide 1" })).toHaveAttribute(
      "class",
      "",
    );
  });

  it("should jump to the targeted page when clicked in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
          <Carousel.Slide data-testid="slide-2" />
        </Carousel.Viewport>
        <Carousel.IndicatorGroup label="Choose slide">
          <Carousel.Indicator index={0} />
          <Carousel.Indicator index={1} />
          <Carousel.Indicator index={2} />
        </Carousel.IndicatorGroup>
      </Carousel.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Slide 3" }));

    expect(screen.getByTestId("slide-2")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should call onPageChange with the targeted page when clicked in controlled mode", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    function Parent() {
      const [page, setPage] = useState(0);
      return (
        <Carousel.Root
          ariaLabel="Featured products"
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
          <Carousel.IndicatorGroup label="Choose slide">
            <Carousel.Indicator index={0} />
            <Carousel.Indicator index={1} />
            <Carousel.Indicator index={2} />
          </Carousel.IndicatorGroup>
        </Carousel.Root>
      );
    }

    render(<Parent />);

    await user.click(screen.getByRole("button", { name: "Slide 2" }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("should invoke the consumer's onClick handler before navigating", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Carousel.Root ariaLabel="Featured products">
        <Carousel.Viewport>
          <Carousel.Slide data-testid="slide-0" />
          <Carousel.Slide data-testid="slide-1" />
        </Carousel.Viewport>
        <Carousel.IndicatorGroup label="Choose slide">
          <Carousel.Indicator index={0} />
          <Carousel.Indicator index={1} onClick={onClick} />
        </Carousel.IndicatorGroup>
      </Carousel.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Slide 2" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("slide-1")).toHaveAttribute(
      "data-state",
      "active",
    );
  });
});

describe("Indicator context errors", () => {
  it.each([
    [
      "Carousel.IndicatorGroup",
      () => <Carousel.IndicatorGroup label="Choose slide" />,
    ],
    ["Carousel.Indicator", () => <Carousel.Indicator index={0} />],
  ] as const)(
    "should throw an error when %s is used outside Carousel.Root",
    (_, ComponentRenderer) => {
      expect(() => {
        render(ComponentRenderer());
      }).toThrow("Component must be rendered as a child of Carousel.Root");
    },
  );
});
