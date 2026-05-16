import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CheckboxCard } from "../CheckboxCard";

describe("CheckboxCard disabled", () => {
  it("sets the native disabled attribute", () => {
    // Arrange & Act
    render(<CheckboxCard.Root aria-label="Enable feature" disabled />);

    // Assert
    expect(
      screen.getByRole("checkbox", { name: "Enable feature" }),
    ).toBeDisabled();
  });

  it('sets data-disabled="" when disabled', () => {
    // Arrange & Act
    render(<CheckboxCard.Root aria-label="Enable feature" disabled />);

    // Assert
    expect(
      screen.getByRole("checkbox", { name: "Enable feature" }),
    ).toHaveAttribute("data-disabled", "");
  });

  it("does not set data-disabled when not disabled", () => {
    // Arrange & Act
    render(<CheckboxCard.Root aria-label="Enable feature" />);

    // Assert
    expect(
      screen.getByRole("checkbox", { name: "Enable feature" }),
    ).not.toHaveAttribute("data-disabled");
  });

  it("does not toggle when disabled", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxCard.Root
        aria-label="Enable feature"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    // Act
    await user.click(screen.getByRole("checkbox", { name: "Enable feature" }));

    // Assert
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
