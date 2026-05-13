import { render, screen } from "@testing-library/react";

import { Portal } from "../Portal";

describe("Portal basic rendering", () => {
  it("renders children into document.body", () => {
    // Arrange & Act
    render(
      <Portal>
        <p>Portal content</p>
      </Portal>,
    );

    // Assert
    expect(screen.getByText("Portal content")).toBeInTheDocument();
  });
});
