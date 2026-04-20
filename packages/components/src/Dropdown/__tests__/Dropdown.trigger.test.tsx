import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "../Dropdown";

describe("Dropdown trigger", () => {
  it("toggles aria-expanded when the trigger is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
      </Dropdown.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Options" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Act
    await user.click(trigger);

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Act again
    await user.click(trigger);

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("drives the native popover open/closed when the trigger is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>Items</Dropdown.Content>
      </Dropdown.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Options" });
    const menu = screen.getByRole("menu", { hidden: true });
    // Popover polyfill: open state is mirrored to `data-popover-open`.
    expect(menu).not.toHaveAttribute("data-popover-open");

    // Act
    await user.click(trigger);

    // Assert
    expect(menu).toHaveAttribute("data-popover-open");

    // Act
    await user.click(trigger);

    // Assert
    expect(menu).not.toHaveAttribute("data-popover-open");
  });
});
