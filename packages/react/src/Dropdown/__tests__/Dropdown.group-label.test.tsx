import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "../Dropdown";

describe("Dropdown.Group and Dropdown.Label", () => {
  it("renders Group with role=group wrapping its items", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group>
            <Dropdown.Item>Rename</Dropdown.Item>
            <Dropdown.Item>Delete</Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const group = screen.getByRole("group", { hidden: true });
    expect(group).toBeInTheDocument();
  });

  it("associates Label with its enclosing Group via aria-labelledby", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group>
            <Dropdown.Label>Actions</Dropdown.Label>
            <Dropdown.Item>Rename</Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert — accessible name of the group comes from the label
    const group = screen.getByRole("group", { name: "Actions", hidden: true });
    expect(group).toBeInTheDocument();
  });

  it("does not treat Label as a menuitem in arrow-key traversal", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Actions</Dropdown.Label>
          <Dropdown.Item>Rename</Dropdown.Item>
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const rename = screen.getByRole("menuitem", { name: "Rename", hidden: true });
    const del = screen.getByRole("menuitem", { name: "Delete", hidden: true });

    // Act — starts on first menuitem (Rename), skipping the label
    expect(rename).toHaveFocus();
    await user.keyboard("{ArrowDown}");

    // Assert
    expect(del).toHaveFocus();
  });
});
