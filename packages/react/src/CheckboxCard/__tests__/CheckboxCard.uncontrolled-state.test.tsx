import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CheckboxCard } from "../CheckboxCard";

describe("CheckboxCard uncontrolled state", () => {
  it("starts unchecked when defaultChecked is omitted", () => {
    // Arrange & Act
    render(<CheckboxCard.Root aria-label="Enable feature" />);

    // Assert
    expect(
      screen.getByRole("checkbox", { name: "Enable feature" }),
    ).toHaveAttribute("aria-checked", "false");
  });

  it("starts checked when defaultChecked is true", () => {
    // Arrange & Act
    render(<CheckboxCard.Root aria-label="Enable feature" defaultChecked />);

    // Assert
    expect(
      screen.getByRole("checkbox", { name: "Enable feature" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("toggles from unchecked to checked on click", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<CheckboxCard.Root aria-label="Enable feature" />);
    const card = screen.getByRole("checkbox", { name: "Enable feature" });

    // Act
    await user.click(card);

    // Assert
    expect(card).toHaveAttribute("aria-checked", "true");
    expect(card).toHaveAttribute("data-state", "checked");
  });

  it("toggles from checked to unchecked on second click", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<CheckboxCard.Root aria-label="Enable feature" defaultChecked />);
    const card = screen.getByRole("checkbox", { name: "Enable feature" });

    // Act
    await user.click(card);

    // Assert
    expect(card).toHaveAttribute("aria-checked", "false");
    expect(card).toHaveAttribute("data-state", "unchecked");
  });

  it("fires onCheckedChange with the new value on toggle", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxCard.Root
        aria-label="Enable feature"
        onCheckedChange={onCheckedChange}
      />,
    );

    // Act
    await user.click(screen.getByRole("checkbox", { name: "Enable feature" }));

    // Assert
    expect(onCheckedChange).toHaveBeenCalledOnce();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
