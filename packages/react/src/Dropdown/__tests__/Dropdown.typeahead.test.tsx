import { fireEvent, render, screen } from "@testing-library/react";
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

  it("resets the typeahead query after a pause so the next keystroke starts a fresh search", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Banana</Dropdown.Item>
          <Dropdown.Item>Cherry</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const banana = screen.getByRole("menuitem", {
      name: "Banana",
      hidden: true,
    });
    const cherry = screen.getByRole("menuitem", {
      name: "Cherry",
      hidden: true,
    });

    // Act — match "Banana"
    await user.keyboard("b");
    expect(banana).toHaveFocus();

    // Act — wait past the typeahead reset window, then start a fresh search
    await new Promise((resolve) => setTimeout(resolve, 600));
    await user.keyboard("c");

    // Assert — the query did not accumulate to "bc"; it reset to "c"
    expect(cherry).toHaveFocus();
  });

  it("cycles through items sharing a starting letter when the same letter is pressed repeatedly", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Apple</Dropdown.Item>
          <Dropdown.Item>Apricot</Dropdown.Item>
          <Dropdown.Item>Avocado</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const apple = screen.getByRole("menuitem", { name: "Apple", hidden: true });
    const apricot = screen.getByRole("menuitem", {
      name: "Apricot",
      hidden: true,
    });
    const avocado = screen.getByRole("menuitem", {
      name: "Avocado",
      hidden: true,
    });
    expect(apple).toHaveFocus();

    // Act
    await user.keyboard("a");

    // Assert
    expect(apricot).toHaveFocus();

    // Act
    await user.keyboard("a");

    // Assert
    expect(avocado).toHaveFocus();

    // Act — wraps back to Apple
    await user.keyboard("a");

    // Assert
    expect(apple).toHaveFocus();
  });

  it("ignores non-printable keys so they do not pollute the typeahead query", () => {
    // Arrange
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Apple</Dropdown.Item>
          <Dropdown.Item>Banana</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const menu = screen.getByRole("menu", { hidden: true });
    const banana = screen.getByRole("menuitem", {
      name: "Banana",
      hidden: true,
    });

    // Act — "Tab" is a multi-character event.key (length 3), so the
    //        typeahead branch must be skipped. If the length guard
    //        weren't there, the query would accumulate to "tabb" after
    //        the following "b" press and no item would match.
    fireEvent.keyDown(menu, { key: "Tab" });
    fireEvent.keyDown(menu, { key: "b" });

    // Assert — the "Tab" press did not contribute to the typeahead
    //          query; "b" started a fresh search and matched Banana.
    expect(banana).toHaveFocus();
  });
});
