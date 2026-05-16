import { render, screen } from "@testing-library/react";

import { Switch } from "../Switch";

describe("Switch basic rendering", () => {
  it('renders a <button type="button" role="switch">', () => {
    // Arrange & Act
    render(<Switch.Root aria-label="Enable notifications" />);
    const sw = screen.getByRole("switch", { name: "Enable notifications" });

    // Assert
    expect(sw.tagName).toBe("BUTTON");
    expect(sw).toHaveAttribute("type", "button");
  });

  it('defaults aria-checked="false" when unchecked', () => {
    // Arrange & Act
    render(<Switch.Root aria-label="Enable notifications" />);

    // Assert
    expect(
      screen.getByRole("switch", { name: "Enable notifications" }),
    ).toHaveAttribute("aria-checked", "false");
  });

  it('defaults data-state="unchecked" on mount', () => {
    // Arrange & Act
    render(<Switch.Root aria-label="Enable notifications" />);

    // Assert
    expect(
      screen.getByRole("switch", { name: "Enable notifications" }),
    ).toHaveAttribute("data-state", "unchecked");
  });

  it("renders Switch.Thumb as a <span> inside the root", () => {
    // Arrange & Act
    render(
      <Switch.Root aria-label="Enable notifications">
        <Switch.Thumb data-testid="thumb" />
      </Switch.Root>,
    );

    // Assert
    const thumb = screen.getByTestId("thumb");
    expect(thumb.tagName).toBe("SPAN");
    expect(thumb).toBeInTheDocument();
  });

  it('sets aria-hidden="true" on the Thumb', () => {
    // Arrange & Act
    render(
      <Switch.Root aria-label="Enable notifications">
        <Switch.Thumb data-testid="thumb" />
      </Switch.Root>,
    );

    // Assert
    expect(screen.getByTestId("thumb")).toHaveAttribute("aria-hidden", "true");
  });

  it('sets data-state="unchecked" on Thumb by default', () => {
    // Arrange & Act
    render(
      <Switch.Root aria-label="Enable notifications">
        <Switch.Thumb data-testid="thumb" />
      </Switch.Root>,
    );

    // Assert
    expect(screen.getByTestId("thumb")).toHaveAttribute(
      "data-state",
      "unchecked",
    );
  });
});
