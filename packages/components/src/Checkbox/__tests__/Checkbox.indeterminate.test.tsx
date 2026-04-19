import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "../Checkbox";

describe("Checkbox indeterminate state", () => {
  it('exposes aria-checked="mixed" when defaultChecked is "indeterminate"', () => {
    // Arrange & Act
    render(
      <Checkbox.Root
        defaultChecked="indeterminate"
        aria-label="Accept terms"
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    // Assert
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
  });

  it('sets data-state="indeterminate" on the root in indeterminate mode', () => {
    // Arrange & Act
    render(
      <Checkbox.Root
        defaultChecked="indeterminate"
        aria-label="Accept terms"
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    // Assert
    expect(checkbox).toHaveAttribute("data-state", "indeterminate");
  });

  it("resolves to checked=true on the first click (WAI-ARIA tri-state convention)", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox.Root
        defaultChecked="indeterminate"
        onCheckedChange={onCheckedChange}
        aria-label="Accept terms"
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    // Act
    await user.click(checkbox);

    // Assert
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(checkbox).toHaveAttribute("data-state", "checked");
  });

  it('honours controlled checked="indeterminate" across re-renders', () => {
    // Arrange
    const { rerender } = render(
      <Checkbox.Root
        checked={false}
        onCheckedChange={() => {}}
        aria-label="Accept terms"
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    // Act
    rerender(
      <Checkbox.Root
        checked="indeterminate"
        onCheckedChange={() => {}}
        aria-label="Accept terms"
      />,
    );

    // Assert
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    expect(checkbox).toHaveAttribute("data-state", "indeterminate");
  });
});
