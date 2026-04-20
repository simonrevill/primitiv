import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Dropdown } from "../Dropdown";

describe("Dropdown.CheckboxItem", () => {
  it("renders as role=menuitemcheckbox with aria-checked reflecting its state", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem defaultChecked>Show grid</Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const item = screen.getByRole("menuitemcheckbox", {
      name: "Show grid",
      hidden: true,
    });
    expect(item).toHaveAttribute("aria-checked", "true");
  });

  it("toggles the checked state on click and fires onCheckedChange (uncontrolled)", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem onCheckedChange={onCheckedChange}>
            Show grid
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitemcheckbox", {
      name: "Show grid",
      hidden: true,
    });
    expect(item).toHaveAttribute("aria-checked", "false");

    // Act — re-open because the first click closes the menu
    await user.click(item);

    // Assert
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
  });

  it("stays open when onSelect calls preventDefault", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSelect = vi.fn((event: Event) => event.preventDefault());
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem onSelect={onSelect}>
            Show grid
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitemcheckbox", {
      name: "Show grid",
      hidden: true,
    });
    const menu = screen.getByRole("menu", { hidden: true });

    // Act
    await user.click(item);

    // Assert
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(item).toHaveAttribute("aria-checked", "true");
    expect(menu).toHaveAttribute("data-popover-open");
  });

  it("reads the checked value from the consumer in controlled mode", async () => {
    // Arrange
    const user = userEvent.setup();

    function Controlled() {
      const [checked, setChecked] = useState<boolean | "indeterminate">(
        "indeterminate",
      );
      return (
        <Dropdown.Root defaultOpen>
          <Dropdown.Trigger>Options</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.CheckboxItem
              checked={checked}
              onCheckedChange={setChecked}
            >
              Show grid
            </Dropdown.CheckboxItem>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    }

    render(<Controlled />);
    const item = screen.getByRole("menuitemcheckbox", {
      name: "Show grid",
      hidden: true,
    });
    // aria-checked="mixed" is the ARIA spelling of tri-state indeterminate
    expect(item).toHaveAttribute("aria-checked", "mixed");

    // Act — indeterminate resolves to checked per WAI-ARIA tri-state rules
    await user.click(item);

    // Assert
    expect(item).toHaveAttribute("aria-checked", "true");
  });
});
