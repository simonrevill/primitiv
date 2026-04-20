import { render, screen } from "@testing-library/react";

import { Dropdown } from "../Dropdown";

describe("Dropdown basic rendering", () => {
  it("renders a trigger button with the ARIA attributes the menu pattern requires", () => {
    // Arrange & Act
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
      </Dropdown.Root>,
    );

    // Assert
    const trigger = screen.getByRole("button", { name: "Options" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls");
  });
});
