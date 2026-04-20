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

  it("does not fire onCheckedChange when a disabled Dropdown.CheckboxItem is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem disabled onCheckedChange={onCheckedChange}>
            Show hidden
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitemcheckbox", {
      name: "Show hidden",
      hidden: true,
    });
    expect(item).toHaveAttribute("aria-disabled", "true");

    // Act
    await user.click(item);

    // Assert
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(item).toHaveAttribute("aria-checked", "false");
  });

  it("does not fire onValueChange when a disabled Dropdown.RadioItem is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.RadioGroup onValueChange={onValueChange}>
            <Dropdown.RadioItem value="a" disabled>
              A
            </Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitemradio", { name: "A", hidden: true });
    expect(item).toHaveAttribute("aria-disabled", "true");

    // Act
    await user.click(item);

    // Assert
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not open the submenu when a disabled Dropdown.SubTrigger is clicked or receives ArrowRight", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>File</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Sub>
            <Dropdown.SubTrigger disabled>Open Recent</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item>Project A</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const subTrigger = screen.getByRole("menuitem", {
      name: "Open Recent",
      hidden: true,
    });
    expect(subTrigger).toHaveAttribute("aria-disabled", "true");
    expect(subTrigger).toHaveAttribute("aria-expanded", "false");

    // Act — click is a no-op
    await user.click(subTrigger);
    expect(subTrigger).toHaveAttribute("aria-expanded", "false");

    // Act — ArrowRight is a no-op
    subTrigger.focus();
    await user.keyboard("{ArrowRight}");

    // Assert
    expect(subTrigger).toHaveAttribute("aria-expanded", "false");
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
