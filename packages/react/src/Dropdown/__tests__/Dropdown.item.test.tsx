import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "../Dropdown";

describe("Dropdown.Item", () => {
  it("renders as a <li role=menuitem> that is part of the tab sequence", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const item = screen.getByRole("menuitem", { name: "Rename", hidden: true });
    expect(item.tagName).toBe("LI");
  });

  it("fires onSelect and closes the dropdown when clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect}>Rename</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitem", { name: "Rename", hidden: true });
    const menu = screen.getByRole("menu", { hidden: true });
    const trigger = screen.getByRole("button", { name: "Options" });
    expect(menu).toHaveAttribute("data-popover-open");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Act
    await user.click(item);

    // Assert
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(menu).not.toHaveAttribute("data-popover-open");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("stays open if the onSelect handler calls preventDefault", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSelect = vi.fn((event: Event) => event.preventDefault());
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect}>Rename</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitem", { name: "Rename", hidden: true });
    const menu = screen.getByRole("menu", { hidden: true });

    // Act
    await user.click(item);

    // Assert
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(menu).toHaveAttribute("data-popover-open");
  });
});
