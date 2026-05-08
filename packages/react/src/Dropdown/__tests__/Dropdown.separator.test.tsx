import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "../Dropdown";

describe("Dropdown.Separator", () => {
  it("renders as a non-focusable element with role=separator", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const separator = screen.getByRole("separator", { hidden: true });
    expect(separator).toBeInTheDocument();
  });

  it("is skipped by ArrowDown focus traversal", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const del = screen.getByRole("menuitem", { name: "Delete", hidden: true });

    // Act
    await user.keyboard("{ArrowDown}");

    // Assert — arrow skips past the separator onto Delete
    expect(del).toHaveFocus();
  });
});
