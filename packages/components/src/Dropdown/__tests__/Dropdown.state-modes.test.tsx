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

    // Act — external control opens it (no onOpenChange yet, state is external)
    await user.click(external);

    // Assert — controlled prop flows through to ARIA + popover state
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(menu).toHaveAttribute("data-popover-open");

    // Act — trigger closes it, which must route through onOpenChange
    await user.click(trigger);

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("honours controlled open prop on Dropdown.Sub and defers to onOpenChange", async () => {
    // Arrange
    const onOpenChange = vi.fn();
    function ControlledSub() {
      const [subOpen, setSubOpen] = useState(false);
      return (
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
      );
    }
    const user = userEvent.setup();
    render(<ControlledSub />);
    const subTrigger = screen.getByRole("menuitem", {
      name: "Open Recent",
      hidden: true,
    });
    expect(subTrigger).toHaveAttribute("aria-expanded", "false");

    // Act — clicking the SubTrigger routes state through the parent
    await user.click(subTrigger);

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(subTrigger).toHaveAttribute("aria-expanded", "true");
  });
});
