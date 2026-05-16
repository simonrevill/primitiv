import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RadioCard } from "../RadioCard";

describe("RadioCard disabled items", () => {
  it("sets the native disabled attribute on a disabled item", () => {
    // Arrange & Act
    render(
      <RadioCard.Root aria-label="Plan">
        <RadioCard.Item value="starter" disabled>
          Starter
        </RadioCard.Item>
      </RadioCard.Root>,
    );

    // Assert
    expect(screen.getByRole("radio", { name: "Starter" })).toBeDisabled();
  });

  it("does not change selection when a disabled item is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioCard.Root aria-label="Plan" onValueChange={onValueChange}>
        <RadioCard.Item value="starter" disabled>
          Starter
        </RadioCard.Item>
      </RadioCard.Root>,
    );

    // Act
    await user.click(screen.getByRole("radio", { name: "Starter" }));

    // Assert
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("excludes disabled items from the roving-tabindex home base", () => {
    // Arrange & Act — no default value, first NON-disabled item is the tab stop
    render(
      <RadioCard.Root aria-label="Plan">
        <RadioCard.Item value="starter" disabled>
          Starter
        </RadioCard.Item>
        <RadioCard.Item value="pro">Pro</RadioCard.Item>
      </RadioCard.Root>,
    );

    // Assert
    expect(screen.getByRole("radio", { name: "Starter" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveAttribute(
      "tabindex",
      "0",
    );
  });
});
