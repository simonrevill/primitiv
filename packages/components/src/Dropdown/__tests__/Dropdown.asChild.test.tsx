import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "../Dropdown";

describe("Dropdown asChild", () => {
  it("delegates Trigger to the child element via asChild, preserving ARIA wiring", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <a href="#menu" data-testid="custom-trigger">
            Options
          </a>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert — Trigger renders as the <a>, not a <button>
    const trigger = screen.getByTestId("custom-trigger");
    expect(trigger.tagName).toBe("A");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Act
    await user.click(trigger);

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("delegates Content to the child element via asChild", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content asChild>
          <div data-testid="custom-content">
            <Dropdown.Item>Rename</Dropdown.Item>
          </div>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const content = screen.getByTestId("custom-content");
    expect(content.tagName).toBe("DIV");
    expect(content).toHaveAttribute("role", "menu");
    expect(content).toHaveAttribute("popover", "auto");
  });

  it("delegates Item to the child element via asChild and still auto-closes on click", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item asChild onSelect={onSelect}>
            <a href="#rename" data-testid="custom-item">
              Rename
            </a>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByTestId("custom-item");
    expect(item.tagName).toBe("A");
    expect(item).toHaveAttribute("role", "menuitem");
    const menu = screen.getByRole("menu", { hidden: true });
    expect(menu).toHaveAttribute("data-popover-open");

    // Act
    await user.click(item);

    // Assert
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(menu).not.toHaveAttribute("data-popover-open");
  });
});
