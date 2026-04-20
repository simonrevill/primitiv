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

  it("renders Content as a native-popover <menu role=menu> wired to the trigger via aria-controls", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>Items go here</Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const trigger = screen.getByRole("button", { name: "Options" });
    // `hidden: true` — a closed `popover` element is hidden from the
    // accessibility tree by the browser. In jsdom the popover never
    // opens either way, so we have to include hidden nodes to see it.
    const menu = screen.getByRole("menu", { hidden: true });
    expect(menu.tagName).toBe("MENU");
    expect(menu).toHaveAttribute("popover", "auto");
    // aria-controls on the trigger and id on the content must match so
    // AT and browser popover-invoker wiring both resolve.
    expect(menu.id).toBeTruthy();
    expect(trigger).toHaveAttribute("aria-controls", menu.id);
  });
});
