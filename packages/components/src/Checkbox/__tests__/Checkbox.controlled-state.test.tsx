import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Checkbox } from "../Checkbox";

describe("Checkbox controlled state", () => {
  it("reflects the controlled `checked` prop", () => {
    // Arrange & Act
    const { rerender } = render(
      <Checkbox.Root
        checked={false}
        onCheckedChange={() => {}}
        aria-label="Accept terms"
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    rerender(
      <Checkbox.Root
        checked
        onCheckedChange={() => {}}
        aria-label="Accept terms"
      />,
    );

    // Assert
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(checkbox).toHaveAttribute("data-state", "checked");
  });

  it("does not update its rendered state when the parent refuses to update `checked`", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox.Root
        checked={false}
        onCheckedChange={onCheckedChange}
        aria-label="Accept terms"
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    // Act
    await user.click(checkbox);

    // Assert: callback fired but the rendered state stays false because the
    // parent did not flip the controlled prop.
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });

  it("lets a parent drive the value end to end", async () => {
    // Arrange
    const user = userEvent.setup();
    function Harness() {
      // Start true so the pre-click state can only be correct if the
      // controlled prop is honoured (a broken impl would fall back to
      // defaultChecked=false and render the opposite).
      const [checked, setChecked] = useState(true);
      return (
        <Checkbox.Root
          checked={checked}
          onCheckedChange={setChecked}
          aria-label="Accept terms"
        />
      );
    }
    render(<Harness />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    // Act & Assert
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });
});
