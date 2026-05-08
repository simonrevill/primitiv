import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "../Dropdown";

describe("Dropdown submenus", () => {
  it("renders SubTrigger as a menuitem with aria-haspopup and initially collapsed state", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>File</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>New</Dropdown.Item>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>Open Recent</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item>Project A</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const subTrigger = screen.getByRole("menuitem", {
      name: "Open Recent",
      hidden: true,
    });
    expect(subTrigger).toHaveAttribute("aria-haspopup", "menu");
    expect(subTrigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the SubContent on ArrowRight and focuses its first item", async () => {
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
              <Dropdown.Item>Project B</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const projectA = screen.getByRole("menuitem", {
      name: "Project A",
      hidden: true,
    });

    // Act — focus starts on SubTrigger (the first menuitem in the parent)
    await user.keyboard("{ArrowRight}");

    // Assert
    expect(projectA).toHaveFocus();
  });

  it("closes the SubContent on ArrowLeft and returns focus to the SubTrigger", async () => {
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
    const [, subMenu] = screen.getAllByRole("menu", { hidden: true });
    expect(subMenu).toHaveAttribute("data-popover-open");

    // Act
    await user.keyboard("{ArrowLeft}");

    // Assert
    expect(subMenu).not.toHaveAttribute("data-popover-open");
    expect(subTrigger).toHaveFocus();
  });

  it("does not open the SubContent when the SubTrigger receives a non-ArrowRight key", async () => {
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
    const [, subMenu] = screen.getAllByRole("menu", { hidden: true });
    expect(subTrigger).toHaveAttribute("aria-expanded", "false");

    // Act — press arbitrary key on SubTrigger; must not open the submenu
    subTrigger.focus();
    await user.keyboard("x");

    // Assert
    expect(subTrigger).toHaveAttribute("aria-expanded", "false");
    expect(subMenu).not.toHaveAttribute("data-popover-open");
  });

  it("does not close the SubContent when a non-ArrowLeft key is pressed inside it", async () => {
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
    const [, subMenu] = screen.getAllByRole("menu", { hidden: true });
    const projectA = screen.getByRole("menuitem", {
      name: "Project A",
      hidden: true,
    });

    // Act
    projectA.focus();
    await user.keyboard("x");

    // Assert
    expect(subMenu).toHaveAttribute("data-popover-open");
  });

  it("opens the SubContent popover when the SubTrigger is clicked", async () => {
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
    const [, subMenu] = screen.getAllByRole("menu", { hidden: true });
    expect(subMenu).not.toHaveAttribute("data-popover-open");

    // Act
    await user.click(subTrigger);

    // Assert
    expect(subMenu).toHaveAttribute("data-popover-open");
    expect(subTrigger).toHaveAttribute("aria-expanded", "true");
  });
});
