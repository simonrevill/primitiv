import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Dropdown } from "../Dropdown";

describe("Dropdown state modes", () => {
  it("honours controlled open prop and defers to onOpenChange callback", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button
            type="button"
            data-testid="external-toggle"
            onClick={() => setOpen(true)}
          >
            open externally
          </button>
          <Dropdown.Root
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next);
              setOpen(next);
            }}
          >
            <Dropdown.Trigger>Options</Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>Rename</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </>
      );
    }
    render(<Controlled />);
    const trigger = screen.getByRole("button", { name: "Options" });
    const external = screen.getByTestId("external-toggle");
    const menu = screen.getByRole("menu", { hidden: true });
    expect(menu).not.toHaveAttribute("data-popover-open");

    // Act — external control opens it
    await user.click(external);

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(menu).toHaveAttribute("data-popover-open");

    // Act — trigger closes it
    await user.click(trigger);

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("honours controlled open prop on Dropdown.Sub", async () => {
    // Arrange
    const onOpenChange = vi.fn();
    function ControlledSub() {
      const [subOpen, setSubOpen] = useState(false);
      return (
        <>
          <button
            type="button"
            data-testid="external-sub-toggle"
            onClick={() => setSubOpen(true)}
          >
            open sub externally
          </button>
          <Dropdown.Root defaultOpen>
            <Dropdown.Trigger>File</Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Sub
                open={subOpen}
                onOpenChange={(next) => {
                  onOpenChange(next);
                  setSubOpen(next);
                }}
              >
                <Dropdown.SubTrigger>Open Recent</Dropdown.SubTrigger>
                <Dropdown.SubContent>
                  <Dropdown.Item>Project A</Dropdown.Item>
                </Dropdown.SubContent>
              </Dropdown.Sub>
            </Dropdown.Content>
          </Dropdown.Root>
        </>
      );
    }
    const user = userEvent.setup();
    render(<ControlledSub />);
    const subTrigger = screen.getByRole("menuitem", {
      name: "Open Recent",
      hidden: true,
    });
    const external = screen.getByTestId("external-sub-toggle");
    expect(subTrigger).toHaveAttribute("aria-expanded", "false");

    // Act
    await user.click(external);

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(subTrigger).toHaveAttribute("aria-expanded", "true");
  });
});
