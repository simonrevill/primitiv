import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CheckboxCard } from "../CheckboxCard";

describe("CheckboxCard controlled state", () => {
  it("reflects the checked prop", () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root
        aria-label="Enable feature"
        checked
        onCheckedChange={() => {}}
      />,
    );

    // Assert
    expect(
      screen.getByRole("checkbox", { name: "Enable feature" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("reflects checked=false", () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root
        aria-label="Enable feature"
        checked={false}
        onCheckedChange={() => {}}
      />,
    );

    // Assert
    expect(
      screen.getByRole("checkbox", { name: "Enable feature" }),
    ).toHaveAttribute("aria-checked", "false");
  });

  it("fires onCheckedChange with the new value when clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxCard.Root
        aria-label="Enable feature"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    // Act
    await user.click(screen.getByRole("checkbox", { name: "Enable feature" }));

    // Assert
    expect(onCheckedChange).toHaveBeenCalledOnce();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not change state when parent ignores onCheckedChange", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <CheckboxCard.Root
        aria-label="Enable feature"
        checked={false}
        onCheckedChange={() => {}}
      />,
    );
    const card = screen.getByRole("checkbox", { name: "Enable feature" });

    // Act
    await user.click(card);

    // Assert — controlled value not updated
    expect(card).toHaveAttribute("aria-checked", "false");
  });
});
