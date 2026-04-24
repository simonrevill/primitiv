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

  it("removes data-highlighted from a CheckboxItem when the pointer leaves", async () => {
    // Arrange — mirrors the plain-Item unhover contract for the tri-state
    // checkbox variant, which has its own setHighlighted(false) path.
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem>Show bookmarks</Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitemcheckbox", {
      name: "Show bookmarks",
      hidden: true,
    });

    // Act
    await user.hover(item);
    expect(item).toHaveAttribute("data-highlighted");
    await user.unhover(item);

    // Assert
    expect(item).not.toHaveAttribute("data-highlighted");
  });

  it("removes data-highlighted from a RadioItem when the pointer leaves", async () => {
    // Arrange — mirrors the plain-Item unhover contract for the radio
    // variant, which has its own setHighlighted(false) path.
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.RadioGroup>
            <Dropdown.RadioItem value="light">Light</Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitemradio", {
      name: "Light",
      hidden: true,
    });

    // Act
    await user.hover(item);
    expect(item).toHaveAttribute("data-highlighted");
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

  it("opens the sub-menu and sets aria-expanded when the pointer enters the SubTrigger", async () => {
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
    expect(subTrigger).toHaveAttribute("aria-expanded", "false");

    // Act
    await user.hover(subTrigger);

    // Assert
    expect(subMenu).toHaveAttribute("data-popover-open");
    expect(subTrigger).toHaveAttribute("aria-expanded", "true");
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
    // Arrange — render with sub already open; focus auto-lands in sub-content
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
    // sub.open=true on render, so data-highlighted is present without any hover
    expect(subTrigger).toHaveAttribute("data-highlighted");

    // Act — ArrowLeft from inside the sub-content closes the sub-menu;
    // focus never passes through the sub-trigger so hovered stays false
    await user.keyboard("{ArrowLeft}");

    // Assert — sub.open is now false and pointer never hovered the trigger
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

  it("closes an open sub-menu when the pointer moves onto a sibling item in the parent menu", async () => {
    // Mirrors the keyboard behaviour (ArrowLeft returns focus to the parent
    // and closes the sub). With the mouse, moving off the sub-trigger and
    // onto another item in the same parent menu must likewise close the sub
    // and clear the sub-trigger's data-highlighted, while the newly hovered
    // item picks up data-highlighted.
    const user = userEvent.setup();
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
    const subTrigger = screen.getByRole("menuitem", {
      name: "Open Recent",
      hidden: true,
    });
    const sibling = screen.getByRole("menuitem", {
      name: "New",
      hidden: true,
    });
    const [, subMenu] = screen.getAllByRole("menu", { hidden: true });

    // Act — hover sub-trigger to open, then move onto a sibling item
    await user.hover(subTrigger);
    expect(subMenu).toHaveAttribute("data-popover-open");
    expect(subTrigger).toHaveAttribute("aria-expanded", "true");
    expect(subTrigger).toHaveAttribute("data-highlighted");

    await user.hover(sibling);

    // Assert — sub has closed, its trigger is no longer highlighted, and the
    // sibling owns data-highlighted.
    expect(subMenu).not.toHaveAttribute("data-popover-open");
    expect(subTrigger).toHaveAttribute("aria-expanded", "false");
    expect(subTrigger).not.toHaveAttribute("data-highlighted");
    expect(sibling).toHaveAttribute("data-highlighted");
  });

  it("supplants an open sibling sub when the pointer hovers a second SubTrigger", async () => {
    // Two sibling subs in the same parent menu. Hovering A opens A, then
    // hovering B must close A and open B — the new sub's registration
    // invokes the previously-registered close callback on the way in,
    // rather than waiting for a separate "leave A" event.
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
          <Dropdown.Sub>
            <Dropdown.SubTrigger>Share</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item>Email</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const subTriggerA = screen.getByRole("menuitem", {
      name: "Open Recent",
      hidden: true,
    });
    const subTriggerB = screen.getByRole("menuitem", {
      name: "Share",
      hidden: true,
    });

    // Act — open A via hover, then move onto B's trigger
    await user.hover(subTriggerA);
    expect(subTriggerA).toHaveAttribute("aria-expanded", "true");
    await user.hover(subTriggerB);

    // Assert — A has been supplanted by B without any sibling-item
    // bouncing, proving B's registration ran the previous close callback.
    expect(subTriggerA).toHaveAttribute("aria-expanded", "false");
    expect(subTriggerB).toHaveAttribute("aria-expanded", "true");
  });
});
