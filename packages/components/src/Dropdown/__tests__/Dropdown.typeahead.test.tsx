import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "../Dropdown";

describe("Dropdown typeahead", () => {
  it("moves focus to the next item starting with the typed letter", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Apple</Dropdown.Item>
          <Dropdown.Item>Banana</Dropdown.Item>
          <Dropdown.Item>Cherry</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const banana = screen.getByRole("menuitem", { name: "Banana", hidden: true });

    // Act
    await user.keyboard("b");

    // Assert
    expect(banana).toHaveFocus();
  });
});
