import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Dropdown } from "../Dropdown";

describe("Dropdown.RadioGroup and Dropdown.RadioItem", () => {
  it("renders each item as role=menuitemradio with aria-checked matching the group value", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Theme</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.RadioGroup defaultValue="light">
            <Dropdown.RadioItem value="light">Light</Dropdown.RadioItem>
            <Dropdown.RadioItem value="dark">Dark</Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const light = screen.getByRole("menuitemradio", {
      name: "Light",
      hidden: true,
    });
    const dark = screen.getByRole("menuitemradio", {
      name: "Dark",
      hidden: true,
    });
    expect(light).toHaveAttribute("aria-checked", "true");
    expect(dark).toHaveAttribute("aria-checked", "false");
  });

  it("updates the selected value on click and fires onValueChange (uncontrolled)", async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Theme</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.RadioGroup
            defaultValue="light"
            onValueChange={onValueChange}
          >
            <Dropdown.RadioItem value="light">Light</Dropdown.RadioItem>
            <Dropdown.RadioItem value="dark">Dark</Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const dark = screen.getByRole("menuitemradio", {
      name: "Dark",
      hidden: true,
    });

    // Act
    await user.click(dark);

    // Assert
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith("dark");
  });

  it("stays open when onSelect calls preventDefault", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSelect = vi.fn((event: Event) => event.preventDefault());
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Theme</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.RadioGroup>
            <Dropdown.RadioItem value="dark" onSelect={onSelect}>
              Dark
            </Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const dark = screen.getByRole("menuitemradio", {
      name: "Dark",
      hidden: true,
    });
    const menu = screen.getByRole("menu", { hidden: true });

    // Act
    await user.click(dark);

    // Assert
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(dark).toHaveAttribute("aria-checked", "true");
    expect(menu).toHaveAttribute("data-popover-open");
  });

  it("reflects the consumer-driven value in controlled mode", async () => {
    // Arrange
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState("light");
      return (
        <Dropdown.Root defaultOpen>
          <Dropdown.Trigger>Theme</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.RadioGroup value={value} onValueChange={setValue}>
              <Dropdown.RadioItem value="light">Light</Dropdown.RadioItem>
              <Dropdown.RadioItem value="dark">Dark</Dropdown.RadioItem>
            </Dropdown.RadioGroup>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    }

    render(<Controlled />);
    const light = screen.getByRole("menuitemradio", {
      name: "Light",
      hidden: true,
    });
    const dark = screen.getByRole("menuitemradio", {
      name: "Dark",
      hidden: true,
    });
    expect(light).toHaveAttribute("aria-checked", "true");

    // Act
    await user.click(dark);

    // Assert
    expect(dark).toHaveAttribute("aria-checked", "true");
    expect(light).toHaveAttribute("aria-checked", "false");
  });
});
