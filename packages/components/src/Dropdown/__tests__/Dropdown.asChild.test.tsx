import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "../Dropdown";

describe("Dropdown asChild", () => {
  it("delegates Trigger to the child element via asChild, preserving ARIA wiring", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <a href="#menu" data-testid="custom-trigger">
            Options
          </a>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert — Trigger renders as the <a>, not a <button>
    const trigger = screen.getByTestId("custom-trigger");
    expect(trigger.tagName).toBe("A");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Act
    await user.click(trigger);

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("delegates Content to the child element via asChild", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content asChild>
          <div data-testid="custom-content">
            <Dropdown.Item>Rename</Dropdown.Item>
          </div>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const content = screen.getByTestId("custom-content");
    expect(content.tagName).toBe("DIV");
    expect(content).toHaveAttribute("role", "menu");
    expect(content).toHaveAttribute("popover", "auto");
  });

  it("delegates Item to the child element via asChild and still auto-closes on click", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item asChild onSelect={onSelect}>
            <a href="#rename" data-testid="custom-item">
              Rename
            </a>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByTestId("custom-item");
    expect(item.tagName).toBe("A");
    expect(item).toHaveAttribute("role", "menuitem");
    const menu = screen.getByRole("menu", { hidden: true });
    expect(menu).toHaveAttribute("data-popover-open");

    // Act
    await user.click(item);

    // Assert
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(menu).not.toHaveAttribute("data-popover-open");
  });

  it("delegates Separator to the child element via asChild", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Rename</Dropdown.Item>
          <Dropdown.Separator asChild>
            <hr data-testid="custom-sep" />
          </Dropdown.Separator>
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const sep = screen.getByTestId("custom-sep");
    expect(sep.tagName).toBe("HR");
    expect(sep).toHaveAttribute("role", "separator");
  });

  it("delegates Group to the child element via asChild while still labelling it", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group asChild>
            <section data-testid="custom-group">
              <Dropdown.Label>Actions</Dropdown.Label>
              <Dropdown.Item>Rename</Dropdown.Item>
            </section>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const group = screen.getByTestId("custom-group");
    expect(group.tagName).toBe("SECTION");
    expect(group).toHaveAttribute("role", "group");
    const labelId = group.getAttribute("aria-labelledby");
    expect(labelId).toBeTruthy();
    const label = screen.getByText("Actions");
    expect(label).toHaveAttribute("id", labelId);
  });

  it("delegates Label to the child element via asChild", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group>
            <Dropdown.Label asChild>
              <h2 data-testid="custom-label">Actions</h2>
            </Dropdown.Label>
            <Dropdown.Item>Rename</Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const label = screen.getByTestId("custom-label");
    expect(label.tagName).toBe("H2");
    expect(label).toHaveAttribute("id");
  });

  it("delegates CheckboxItem to the child element via asChild", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem asChild onCheckedChange={onCheckedChange}>
            <a href="#show-hidden" data-testid="custom-check">
              Show hidden
            </a>
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByTestId("custom-check");
    expect(item.tagName).toBe("A");
    expect(item).toHaveAttribute("role", "menuitemcheckbox");
    expect(item).toHaveAttribute("aria-checked", "false");

    // Act
    await user.click(item);

    // Assert
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("delegates RadioGroup to the child element via asChild", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.RadioGroup asChild defaultValue="a">
            <section data-testid="custom-radiogroup">
              <Dropdown.RadioItem value="a">A</Dropdown.RadioItem>
              <Dropdown.RadioItem value="b">B</Dropdown.RadioItem>
            </section>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const group = screen.getByTestId("custom-radiogroup");
    expect(group.tagName).toBe("SECTION");
    expect(group).toHaveAttribute("role", "group");
  });

  it("delegates RadioItem to the child element via asChild", async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.RadioGroup onValueChange={onValueChange}>
            <Dropdown.RadioItem asChild value="a">
              <a href="#a" data-testid="custom-radio">
                A
              </a>
            </Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByTestId("custom-radio");
    expect(item.tagName).toBe("A");
    expect(item).toHaveAttribute("role", "menuitemradio");

    // Act
    await user.click(item);

    // Assert
    expect(onValueChange).toHaveBeenCalledWith("a");
  });

  it("delegates SubTrigger to the child element via asChild", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>File</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Sub>
            <Dropdown.SubTrigger asChild>
              <a href="#open-recent" data-testid="custom-subtrigger">
                Open Recent
              </a>
            </Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item>Project A</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const subTrigger = screen.getByTestId("custom-subtrigger");
    expect(subTrigger.tagName).toBe("A");
    expect(subTrigger).toHaveAttribute("role", "menuitem");
    expect(subTrigger).toHaveAttribute("aria-haspopup", "menu");
    expect(subTrigger).toHaveAttribute("aria-expanded", "false");
  });

  it("delegates SubContent to the child element via asChild", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>File</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Sub defaultOpen>
            <Dropdown.SubTrigger>Open Recent</Dropdown.SubTrigger>
            <Dropdown.SubContent asChild>
              <div data-testid="custom-subcontent">
                <Dropdown.Item>Project A</Dropdown.Item>
              </div>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const subContent = screen.getByTestId("custom-subcontent");
    expect(subContent.tagName).toBe("DIV");
    expect(subContent).toHaveAttribute("role", "menu");
    expect(subContent).toHaveAttribute("popover", "auto");
  });
});
