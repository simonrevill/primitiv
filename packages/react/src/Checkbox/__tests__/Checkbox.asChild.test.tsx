import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "../Checkbox";

describe("Checkbox asChild composition", () => {
  it("Root asChild delegates to the child element while keeping ARIA and toggle wiring", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox.Root
        asChild
        onCheckedChange={onCheckedChange}
        aria-label="Accept terms"
      >
        <li>Accept</li>
      </Checkbox.Root>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    // Assert element is the consumer's <li>
    expect(checkbox.tagName).toBe("LI");
    // ARIA + data-state merged onto the child
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(checkbox).toHaveAttribute("data-state", "unchecked");

    // Act
    await user.click(checkbox);

    // Assert toggle still fires through composed onClick
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("Root asChild lets the consumer override the role for menu-item contexts", () => {
    // Arrange & Act
    render(
      <Checkbox.Root asChild aria-label="Accept terms">
        <li role="menuitemcheckbox">Accept</li>
      </Checkbox.Root>,
    );

    // Assert
    const item = screen.getByRole("menuitemcheckbox", { name: "Accept terms" });
    expect(item).toHaveAttribute("aria-checked", "false");
    expect(item).toHaveAttribute("data-state", "unchecked");
  });

  it("Indicator asChild delegates rendering to the consumer's element", () => {
    // Arrange & Act
    render(
      <Checkbox.Root defaultChecked aria-label="Accept terms">
        <Checkbox.Indicator asChild>
          <svg data-testid="tick" viewBox="0 0 10 10">
            <path d="M1 5l3 3 5-7" />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Root>,
    );

    // Assert
    const tick = screen.getByTestId("tick");
    expect(tick.tagName.toLowerCase()).toBe("svg");
    expect(tick).toHaveAttribute("aria-hidden", "true");
    expect(tick).toHaveAttribute("data-state", "checked");
  });

});
