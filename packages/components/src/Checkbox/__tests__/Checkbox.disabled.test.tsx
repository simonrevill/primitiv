import { render, screen } from "@testing-library/react";

import { Checkbox } from "../Checkbox";

describe("Checkbox disabled state", () => {
  it('sets data-disabled="" on the root so CSS can target the disabled state', () => {
    // Arrange & Act
    render(<Checkbox.Root disabled aria-label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    // Assert
    expect(checkbox).toHaveAttribute("data-disabled", "");
  });

});
