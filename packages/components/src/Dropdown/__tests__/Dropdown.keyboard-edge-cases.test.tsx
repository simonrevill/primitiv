import { fireEvent, render, screen } from "@testing-library/react";

import { Dropdown } from "../Dropdown";

describe("Dropdown keyboard edge cases", () => {
  it("does not surface an error when an arrow key is pressed on a menu with no items", () => {
    // Arrange
    const errors: unknown[] = [];
    const handler = (event: ErrorEvent) => errors.push(event.error ?? event);
    window.addEventListener("error", handler);
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content />
      </Dropdown.Root>,
    );
    const menu = screen.getByRole("menu", { hidden: true });

    // Act — no items, no activeElement inside the menu
    fireEvent.keyDown(menu, { key: "ArrowDown" });

    // Assert — no uncaught error surfaced through the window
    expect(errors).toHaveLength(0);
    window.removeEventListener("error", handler);
  });

  it("does not surface an error when Enter is pressed on a menu with no focused item", () => {
    // Arrange
    const errors: unknown[] = [];
    const handler = (event: ErrorEvent) => errors.push(event.error ?? event);
    window.addEventListener("error", handler);
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Apple</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const menu = screen.getByRole("menu", { hidden: true });
    (document.activeElement as HTMLElement | null)?.blur();

    // Act — items exist, but no item has focus
    fireEvent.keyDown(menu, { key: "Enter" });

    // Assert — no uncaught error surfaced through the window
    expect(errors).toHaveLength(0);
    window.removeEventListener("error", handler);
  });
});
