import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "../Dropdown";

describe("Dropdown mouse interaction", () => {
  it("adds data-highlighted to an Item when the pointer enters it", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitem", { name: "Rename", hidden: true });

    // Act
    await user.hover(item);

    // Assert
    expect(item).toHaveAttribute("data-highlighted");
  });

  it("removes data-highlighted from an Item when the pointer leaves", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitem", { name: "Rename", hidden: true });

    // Act
    await user.hover(item);
    await user.unhover(item);

    // Assert
    expect(item).not.toHaveAttribute("data-highlighted");
  });

  it("adds data-highlighted to a SubTrigger when the pointer enters it", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>File</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>Open Recent</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item>Project A</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const subTrigger = screen.getByRole("menuitem", {
      name: "Open Recent",
      hidden: true,
    });

    // Act
    await user.hover(subTrigger);

    // Assert
    expect(subTrigger).toHaveAttribute("data-highlighted");
  });

  it("keeps data-highlighted on a SubTrigger after the pointer leaves while its sub-menu stays open", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>File</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Sub defaultOpen>
            <Dropdown.SubTrigger>Open Recent</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item>Project A</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const subTrigger = screen.getByRole("menuitem", {
      name: "Open Recent",
      hidden: true,
    });

    // Act — hover then move the pointer away; sub-menu remains open
    await user.hover(subTrigger);
    await user.unhover(subTrigger);

    // Assert — sub.open is true, so data-highlighted must persist
    expect(subTrigger).toHaveAttribute("data-highlighted");
  });

  it("removes data-highlighted from a SubTrigger when the sub-menu closes and the pointer is not over it", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>File</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Sub defaultOpen>
            <Dropdown.SubTrigger>Open Recent</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item>Project A</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const subTrigger = screen.getByRole("menuitem", {
      name: "Open Recent",
      hidden: true,
    });

    // Act — pointer is not over the trigger; close the sub-menu with ArrowLeft
    subTrigger.focus();
    await user.keyboard("{ArrowRight}"); // re-open so we can close with ArrowLeft
    await user.keyboard("{ArrowLeft}"); // close

    // Assert — sub.open is now false and pointer never hovered it
    expect(subTrigger).not.toHaveAttribute("data-highlighted");
  });

  it("keeps data-highlighted on all ancestor SubTriggers while nested sub-menus are open", async () => {
    // Arrange
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>File</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Sub defaultOpen>
            <Dropdown.SubTrigger>Open Recent</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Sub defaultOpen>
                <Dropdown.SubTrigger>From Cloud</Dropdown.SubTrigger>
                <Dropdown.SubContent>
                  <Dropdown.Item>Dropbox</Dropdown.Item>
                </Dropdown.SubContent>
              </Dropdown.Sub>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert — both levels are open, so both sub-triggers must be highlighted
    const outerTrigger = screen.getByRole("menuitem", {
      name: "Open Recent",
      hidden: true,
    });
    const innerTrigger = screen.getByRole("menuitem", {
      name: "From Cloud",
      hidden: true,
    });
    expect(outerTrigger).toHaveAttribute("data-highlighted");
    expect(innerTrigger).toHaveAttribute("data-highlighted");
  });
});
