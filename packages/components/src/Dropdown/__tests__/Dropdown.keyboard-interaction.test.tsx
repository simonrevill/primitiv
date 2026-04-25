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

  it("skips items inside a closed sub-content popover when ArrowDown moves past a SubTrigger", async () => {
    // Arrange — the parent Content's items are queried via querySelectorAll,
    // which by default also matches menuitems inside any descendant
    // SubContent popover. Those are not focusable while the sub is closed
    // (display: none), so the user gets stuck on the SubTrigger. Arrow
    // navigation must scope itself to the active popover.
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>File</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>New</Dropdown.Item>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>Open Recent</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item>Project A</Dropdown.Item>
              <Dropdown.Item>Project B</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
          <Dropdown.Separator />
          <Dropdown.CheckboxItem>Show bookmarks</Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const subTrigger = screen.getByRole("menuitem", {
      name: "Open Recent",
      hidden: true,
    });
    const showBookmarks = screen.getByRole("menuitemcheckbox", {
      name: "Show bookmarks",
      hidden: true,
    });

    // Act — focus starts on "New" (first item); ArrowDown lands on the
    // SubTrigger; another ArrowDown must jump past the closed SubContent's
    // items and land on the next parent-level item.
    await user.keyboard("{ArrowDown}");
    expect(subTrigger).toHaveFocus();

    await user.keyboard("{ArrowDown}");

    // Assert
    expect(showBookmarks).toHaveFocus();
  });

  it("skips items inside a closed sub-content popover when ArrowUp moves past a SubTrigger", async () => {
    // Arrange — the inverse of the ArrowDown case: ArrowUp from the item
    // after the Sub must land on the SubTrigger, not on a sub item.
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>File</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>Open Recent</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item>Project A</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
          <Dropdown.Item>New</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const subTrigger = screen.getByRole("menuitem", {
      name: "Open Recent",
      hidden: true,
    });
    const newItem = screen.getByRole("menuitem", {
      name: "New",
      hidden: true,
    });

    // Act — focus starts on the SubTrigger; move down to "New" then back up
    await user.keyboard("{ArrowDown}");
    expect(newItem).toHaveFocus();

    await user.keyboard("{ArrowUp}");

    // Assert
    expect(subTrigger).toHaveFocus();
  });

  it("scopes ArrowDown navigation to items inside the open SubContent rather than wrapping into the parent menu", async () => {
    // Arrange — when focus lives inside an open SubContent, ArrowDown must
    // wrap within the sub's own items and never escape into siblings of
    // the SubTrigger in the parent menu.
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>File</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Sub defaultOpen>
            <Dropdown.SubTrigger>Open Recent</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item>Project A</Dropdown.Item>
              <Dropdown.Item>Project B</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
          <Dropdown.Item>New</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const projectA = screen.getByRole("menuitem", {
      name: "Project A",
      hidden: true,
    });
    const projectB = screen.getByRole("menuitem", {
      name: "Project B",
      hidden: true,
    });

    // Sub auto-focuses its first item on open
    expect(projectA).toHaveFocus();

    // Act — ArrowDown advances within the sub
    await user.keyboard("{ArrowDown}");
    expect(projectB).toHaveFocus();

    // Act — ArrowDown again: wraps within the sub, NOT into "New" in the parent
    await user.keyboard("{ArrowDown}");

    // Assert
    expect(projectA).toHaveFocus();
  });
});
