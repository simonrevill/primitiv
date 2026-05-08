import { render, screen } from "@testing-library/react";

import { Checkbox } from "../Checkbox";

describe("Checkbox basic rendering", () => {
  it('renders a <button> with role="checkbox"', () => {
    // Arrange & Act
    render(<Checkbox.Root aria-label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    // Assert
    expect(checkbox.tagName).toBe("BUTTON");
  });

  it('defaults aria-checked to "false"', () => {
    // Arrange & Act
    render(<Checkbox.Root aria-label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    // Assert
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it('defaults type="button" so the checkbox never submits an enclosing form', () => {
    // Arrange & Act
    render(<Checkbox.Root aria-label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    // Assert
    expect(checkbox).toHaveAttribute("type", "button");
  });

  it('sets data-state="unchecked" on the root when unchecked', () => {
    // Arrange & Act
    render(<Checkbox.Root aria-label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    // Assert
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });
});
