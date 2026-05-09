import { render, screen } from "@testing-library/react";

import { Button } from "../Button";

describe("Button icon usage", () => {
  it("renders an icon-only button with aria-label for accessibility", () => {
    // Arrange & Act
    render(
      <Button aria-label="Close dialog">
        <span aria-hidden="true">✕</span>
      </Button>,
    );

    // Assert
    expect(
      screen.getByRole("button", { name: "Close dialog" }),
    ).toBeInTheDocument();
  });

  it("renders an icon alongside text — icon carries aria-hidden", () => {
    // Arrange & Act
    render(
      <Button>
        <span aria-hidden="true" data-testid="icon">★</span>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: /Save/ });
    const icon = screen.getByTestId("icon");

    // Assert
    expect(button).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("renders an SVG icon — consumer marks it aria-hidden", () => {
    // Arrange & Act
    render(
      <Button aria-label="Submit form">
        <svg
          aria-hidden="true"
          data-testid="svg-icon"
          viewBox="0 0 24 24"
          focusable="false"
        >
          <path d="M5 12l5 5L20 7" />
        </svg>
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Submit form" });
    const svg = screen.getByTestId("svg-icon");

    // Assert
    expect(button).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
