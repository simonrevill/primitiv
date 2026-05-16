import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Switch } from "../Switch";

describe("Switch thumb", () => {
  it("is always mounted when unchecked", () => {
    // Arrange & Act
    render(
      <Switch.Root aria-label="Enable notifications">
        <Switch.Thumb data-testid="thumb" />
      </Switch.Root>,
    );

    // Assert
    expect(screen.getByTestId("thumb")).toBeInTheDocument();
  });

  it("is always mounted when checked", () => {
    // Arrange & Act
    render(
      <Switch.Root aria-label="Enable notifications" defaultChecked>
        <Switch.Thumb data-testid="thumb" />
      </Switch.Root>,
    );

    // Assert
    expect(screen.getByTestId("thumb")).toBeInTheDocument();
  });

  it('sets data-state="checked" when the root is checked', () => {
    // Arrange & Act
    render(
      <Switch.Root aria-label="Enable notifications" defaultChecked>
        <Switch.Thumb data-testid="thumb" />
      </Switch.Root>,
    );

    // Assert
    expect(screen.getByTestId("thumb")).toHaveAttribute("data-state", "checked");
  });

  it('sets data-state="unchecked" when the root is unchecked', () => {
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

  it("updates data-state on the thumb when the switch is toggled", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Switch.Root aria-label="Enable notifications">
        <Switch.Thumb data-testid="thumb" />
      </Switch.Root>,
    );
    const thumb = screen.getByTestId("thumb");

    // Act
    await user.click(
      screen.getByRole("switch", { name: "Enable notifications" }),
    );

    // Assert
    expect(thumb).toHaveAttribute("data-state", "checked");

    // Act again
    await user.click(
      screen.getByRole("switch", { name: "Enable notifications" }),
    );

    // Assert
    expect(thumb).toHaveAttribute("data-state", "unchecked");
  });
});
