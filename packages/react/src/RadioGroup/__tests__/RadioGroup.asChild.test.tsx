import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RadioGroup } from "../RadioGroup";

describe("RadioGroup asChild composition", () => {
  it("Root asChild renders the consumer element with radiogroup role preserved", () => {
    // Arrange & Act
    render(
      <RadioGroup.Root asChild aria-label="Colour">
        <menu data-testid="menu">
          <RadioGroup.Item value="red">Red</RadioGroup.Item>
        </menu>
      </RadioGroup.Root>,
    );

    // Assert
    const root = screen.getByTestId("menu");
    expect(root.tagName).toBe("MENU");
    expect(root).toHaveAttribute("role", "radiogroup");
    expect(root).toHaveAttribute("aria-label", "Colour");
  });

  it("Root asChild allows the consumer to override the role for menu contexts", () => {
    // Arrange & Act
    render(
      <RadioGroup.Root asChild aria-label="Colour">
        <menu role="menu" data-testid="menu">
          <RadioGroup.Item value="red">Red</RadioGroup.Item>
        </menu>
      </RadioGroup.Root>,
    );

    // Assert: the consumer's <menu> is the rendered root. Its own role
    // wins (Slot's "child overrides" rule), and Slot must have merged
    // the Root's aria-label onto it — without asChild the aria-label
    // would sit on a wrapping <div> and not on the <menu>.
    const menuEl = screen.getByTestId("menu");
    expect(menuEl).toHaveAttribute("role", "menu");
    expect(menuEl).toHaveAttribute("aria-label", "Colour");
  });

  it("Item asChild delegates to the child element while keeping ARIA + selection wiring", async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup.Root aria-label="Colour" onValueChange={onValueChange}>
        <RadioGroup.Item value="red" asChild>
          <li>Red</li>
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const item = screen.getByRole("radio", { name: "Red" });

    // Assert element is the consumer's <li>
    expect(item.tagName).toBe("LI");
    expect(item).toHaveAttribute("aria-checked", "false");
    expect(item).toHaveAttribute("data-state", "unchecked");

    // Act
    await user.click(item);

    // Assert selection wiring still fires via composed onClick
    expect(onValueChange).toHaveBeenCalledWith("red");
    expect(item).toHaveAttribute("aria-checked", "true");
  });

  it("Item asChild lets the consumer override the role for menu-item contexts", () => {
    // Arrange & Act
    render(
      <RadioGroup.Root aria-label="Colour">
        <RadioGroup.Item value="red" asChild>
          <li role="menuitemradio">Red</li>
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    // Assert
    const item = screen.getByRole("menuitemradio", { name: "Red" });
    expect(item).toHaveAttribute("aria-checked", "false");
  });

  it("Indicator asChild delegates rendering to the consumer's element", () => {
    // Arrange & Act
    render(
      <RadioGroup.Root aria-label="Colour" defaultValue="red">
        <RadioGroup.Item value="red">
          Red
          <RadioGroup.Indicator asChild>
            <svg data-testid="dot" viewBox="0 0 10 10">
              <circle cx="5" cy="5" r="3" />
            </svg>
          </RadioGroup.Indicator>
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    // Assert
    const dot = screen.getByTestId("dot");
    expect(dot.tagName.toLowerCase()).toBe("svg");
    expect(dot).toHaveAttribute("aria-hidden", "true");
    expect(dot).toHaveAttribute("data-state", "checked");
  });
});
