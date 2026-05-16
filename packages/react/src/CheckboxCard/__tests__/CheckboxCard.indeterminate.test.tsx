import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CheckboxCard } from "../CheckboxCard";

describe("CheckboxCard indeterminate state", () => {
  it('sets aria-checked="mixed" when checked="indeterminate"', () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root
        aria-label="Enable feature"
        checked="indeterminate"
        onCheckedChange={() => {}}
      />,
    );

    // Assert
    expect(
      screen.getByRole("checkbox", { name: "Enable feature" }),
    ).toHaveAttribute("aria-checked", "mixed");
  });

  it('sets data-state="indeterminate" when checked="indeterminate"', () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root
        aria-label="Enable feature"
        checked="indeterminate"
        onCheckedChange={() => {}}
      />,
    );

    // Assert
    expect(
      screen.getByRole("checkbox", { name: "Enable feature" }),
    ).toHaveAttribute("data-state", "indeterminate");
  });

  it("resolves indeterminate to true on click (uncontrolled)", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxCard.Root
        aria-label="Enable feature"
        defaultChecked="indeterminate"
        onCheckedChange={onCheckedChange}
      />,
    );

    // Act
    await user.click(screen.getByRole("checkbox", { name: "Enable feature" }));

    // Assert
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(
      screen.getByRole("checkbox", { name: "Enable feature" }),
    ).toHaveAttribute("aria-checked", "true");
  });
});
