import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "../Dropdown";

describe("Dropdown keyboard interaction", () => {
  it("focuses the first menu item when the dropdown opens", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Options" }));

    // Assert
    expect(
      screen.getByRole("menuitem", { name: "Rename", hidden: true }),
    ).toHaveFocus();
  });

  it("moves focus between items with ArrowDown and ArrowUp, wrapping at both ends", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const rename = screen.getByRole("menuitem", { name: "Rename", hidden: true });
    const duplicate = screen.getByRole("menuitem", {
      name: "Duplicate",
      hidden: true,
    });
    const del = screen.getByRole("menuitem", { name: "Delete", hidden: true });
    expect(rename).toHaveFocus();

    // Act + Assert: forward
    await user.keyboard("{ArrowDown}");
    expect(duplicate).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(del).toHaveFocus();
    // wrap around forward
    await user.keyboard("{ArrowDown}");
    expect(rename).toHaveFocus();

    // Act + Assert: backward + wrap
    await user.keyboard("{ArrowUp}");
    expect(del).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(duplicate).toHaveFocus();
  });

  it("activates the focused item on Enter and closes the dropdown", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect}>Rename</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const menu = screen.getByRole("menu", { hidden: true });

    // Act
    await user.keyboard("{Enter}");

    // Assert
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(menu).not.toHaveAttribute("data-popover-open");
  });

  it("activates the focused item on Space and closes the dropdown", async () => {
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
    const menu = screen.getByRole("menu", { hidden: true });

    // Act — literal space, not "{Space}" (which emits key="Space")
    await user.keyboard(" ");

    // Assert
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(menu).not.toHaveAttribute("data-popover-open");
  });

  it("closes the dropdown on Escape and returns focus to the trigger", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Options" });
    const menu = screen.getByRole("menu", { hidden: true });
    expect(menu).toHaveAttribute("data-popover-open");

    // Act
    await user.keyboard("{Escape}");

    // Assert
    expect(menu).not.toHaveAttribute("data-popover-open");
    expect(trigger).toHaveFocus();
  });

  it("returns focus to the trigger after activating an item with Enter", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Options" });

    // Act
    await user.keyboard("{Enter}");

    // Assert
    expect(trigger).toHaveFocus();
  });

  it("jumps to the first item on Home and the last item on End", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const rename = screen.getByRole("menuitem", { name: "Rename", hidden: true });
    const del = screen.getByRole("menuitem", { name: "Delete", hidden: true });

    // Act
    await user.keyboard("{End}");

    // Assert
    expect(del).toHaveFocus();

    // Act
    await user.keyboard("{Home}");

    // Assert
    expect(rename).toHaveFocus();
  });
});
