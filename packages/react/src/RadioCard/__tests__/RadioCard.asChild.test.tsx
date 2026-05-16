import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RadioCard } from "../RadioCard";

describe("RadioCard asChild", () => {
  it("renders the Root as the consumer element when asChild is set", () => {
    // Arrange & Act
    render(
      <RadioCard.Root asChild aria-label="Plan">
        <section>
          <RadioCard.Item value="pro">Pro</RadioCard.Item>
        </section>
      </RadioCard.Root>,
    );

    // Assert — section rendered, not div; role still present via merged prop
    const group = screen.getByRole("radiogroup", { name: "Plan" });
    expect(group.tagName).toBe("SECTION");
  });

  it("renders the Item as the consumer element when asChild is set", () => {
    // Arrange & Act
    render(
      <RadioCard.Root aria-label="Plan">
        <RadioCard.Item value="pro" asChild>
          <div>Pro card</div>
        </RadioCard.Item>
      </RadioCard.Root>,
    );

    // Assert — div rendered, not button; role and aria-checked merged
    const item = screen.getByRole("radio", { name: "Pro card" });
    expect(item.tagName).toBe("DIV");
    expect(item).toHaveAttribute("aria-checked", "false");
  });

  it("merges onClick onto the asChild Item element", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <RadioCard.Root aria-label="Plan">
        <RadioCard.Item value="pro" asChild onClick={onClick}>
          <div>Pro</div>
        </RadioCard.Item>
      </RadioCard.Root>,
    );

    // Act
    await user.click(screen.getByRole("radio", { name: "Pro" }));

    // Assert
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders the Indicator as the consumer element when asChild is set", () => {
    // Arrange & Act
    render(
      <RadioCard.Root aria-label="Plan" defaultValue="pro">
        <RadioCard.Item value="pro">
          <RadioCard.Indicator asChild>
            <svg data-testid="icon" viewBox="0 0 10 10" />
          </RadioCard.Indicator>
          Pro
        </RadioCard.Item>
      </RadioCard.Root>,
    );

    // Assert — svg rendered, not span; aria-hidden and data-state merged
    const icon = screen.getByTestId("icon");
    expect(icon.tagName).toBe("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("data-state", "checked");
  });
});
