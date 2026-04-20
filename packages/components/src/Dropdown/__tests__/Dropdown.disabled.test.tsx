import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "../Dropdown";

describe("Dropdown disabled items", () => {
  it("marks disabled items with aria-disabled=true and does not fire onSelect on click", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item disabled onSelect={onSelect}>
            Rename
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitem", { name: "Rename", hidden: true });
    expect(item).toHaveAttribute("aria-disabled", "true");

    // Act
    await user.click(item);

    // Assert — onSelect is not called and menu stays open
    expect(onSelect).not.toHaveBeenCalled();
    const menu = screen.getByRole("menu", { hidden: true });
    expect(menu).toHaveAttribute("data-popover-open");
  });

  it("skips disabled items during ArrowDown traversal", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
          <Dropdown.Item disabled>Duplicate</Dropdown.Item>
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const del = screen.getByRole("menuitem", { name: "Delete", hidden: true });

    // Act
    await user.keyboard("{ArrowDown}");

    // Assert — arrow skips past the disabled Duplicate onto Delete
    expect(del).toHaveFocus();
  });
});
