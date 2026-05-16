import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CheckboxCard } from "../CheckboxCard";

describe("CheckboxCard asChild", () => {
  it("renders the Root as the consumer element when asChild is set", () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root asChild aria-label="Enable feature">
        <div>Feature card</div>
      </CheckboxCard.Root>,
    );

    // Assert — div rendered, not button; role and aria-checked merged
    const card = screen.getByRole("checkbox", { name: "Enable feature" });
    expect(card.tagName).toBe("DIV");
    expect(card).toHaveAttribute("aria-checked", "false");
  });

  it("merges onClick onto the asChild Root element", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <CheckboxCard.Root asChild aria-label="Enable feature" onClick={onClick}>
        <div>Feature card</div>
      </CheckboxCard.Root>,
    );

    // Act
    await user.click(screen.getByRole("checkbox", { name: "Enable feature" }));

    // Assert
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders the Indicator as the consumer element when asChild is set", () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root aria-label="Enable feature" defaultChecked>
        <CheckboxCard.Indicator asChild>
          <svg data-testid="icon" viewBox="0 0 10 10" />
        </CheckboxCard.Indicator>
      </CheckboxCard.Root>,
    );

    // Assert — svg rendered, not span; aria-hidden and data-state merged
    const icon = screen.getByTestId("icon");
    expect(icon.tagName).toBe("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("data-state", "checked");
  });
});
