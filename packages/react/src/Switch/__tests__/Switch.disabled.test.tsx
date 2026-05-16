import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Switch } from "../Switch";

describe("Switch disabled", () => {
  it("sets the native disabled attribute", () => {
    // Arrange & Act
    render(<Switch.Root aria-label="Enable notifications" disabled />);

    // Assert
    expect(
      screen.getByRole("switch", { name: "Enable notifications" }),
    ).toBeDisabled();
  });

  it('sets data-disabled="" when disabled', () => {
    // Arrange & Act
    render(<Switch.Root aria-label="Enable notifications" disabled />);

    // Assert
    expect(
      screen.getByRole("switch", { name: "Enable notifications" }),
    ).toHaveAttribute("data-disabled", "");
  });

  it("does not set data-disabled when not disabled", () => {
    // Arrange & Act
    render(<Switch.Root aria-label="Enable notifications" />);

    // Assert
    expect(
      screen.getByRole("switch", { name: "Enable notifications" }),
    ).not.toHaveAttribute("data-disabled");
  });

  it("does not toggle and does not call onCheckedChange when clicked while disabled", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch.Root
        aria-label="Enable notifications"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    // Act
    await user.click(
      screen.getByRole("switch", { name: "Enable notifications" }),
    );

    // Assert
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(
      screen.getByRole("switch", { name: "Enable notifications" }),
    ).toHaveAttribute("aria-checked", "false");
  });
});
