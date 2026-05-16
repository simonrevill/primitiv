import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Switch } from "../Switch";

describe("Switch uncontrolled state", () => {
  it("starts unchecked when defaultChecked is omitted", () => {
    // Arrange & Act
    render(<Switch.Root aria-label="Enable notifications" />);

    // Assert
    expect(
      screen.getByRole("switch", { name: "Enable notifications" }),
    ).toHaveAttribute("aria-checked", "false");
  });

  it("starts checked when defaultChecked={true}", () => {
    // Arrange & Act
    render(<Switch.Root aria-label="Enable notifications" defaultChecked />);

    // Assert
    expect(
      screen.getByRole("switch", { name: "Enable notifications" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it('sets data-state="checked" when defaultChecked={true}', () => {
    // Arrange & Act
    render(<Switch.Root aria-label="Enable notifications" defaultChecked />);

    // Assert
    expect(
      screen.getByRole("switch", { name: "Enable notifications" }),
    ).toHaveAttribute("data-state", "checked");
  });

  it("toggles to checked on first click", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Switch.Root aria-label="Enable notifications" />);
    const sw = screen.getByRole("switch", { name: "Enable notifications" });

    // Act
    await user.click(sw);

    // Assert
    expect(sw).toHaveAttribute("aria-checked", "true");
    expect(sw).toHaveAttribute("data-state", "checked");
  });

  it("toggles back to unchecked on second click", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Switch.Root aria-label="Enable notifications" defaultChecked />);
    const sw = screen.getByRole("switch", { name: "Enable notifications" });

    // Act
    await user.click(sw);

    // Assert
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(sw).toHaveAttribute("data-state", "unchecked");
  });

  it("fires onCheckedChange with the new value on each toggle", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch.Root
        aria-label="Enable notifications"
        onCheckedChange={onCheckedChange}
      />,
    );

    // Act
    await user.click(screen.getByRole("switch", { name: "Enable notifications" }));

    // Assert
    expect(onCheckedChange).toHaveBeenCalledOnce();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
