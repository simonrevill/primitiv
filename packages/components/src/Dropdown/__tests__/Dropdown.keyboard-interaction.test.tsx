import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "../Dropdown";

describe("Dropdown keyboard interaction", () => {
  it("focuses the first menu item when the dropdown opens", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Options" }));

    // Assert
    expect(
      screen.getByRole("menuitem", { name: "Rename", hidden: true }),
    ).toHaveFocus();
  });
});
