import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Collapsible } from "../Collapsible";

describe("Collapsible uncontrolled state tests", () => {
  it("should render Content visible when defaultOpen is true", () => {
    // Arrange
    render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const content = screen.getByTestId("content");

    // Assert
    expect(content).toBeVisible();
  });

  it("should set data-state='open' on Root, Trigger, and Content when defaultOpen is true", () => {
    // Arrange
    render(
      <Collapsible.Root defaultOpen data-testid="test-collapsible">
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const root = screen.getByTestId("test-collapsible");
    const trigger = screen.getByRole("button", { name: "Toggle" });
    const content = screen.getByTestId("content");

    // Assert
    expect(root).toHaveAttribute("data-state", "open");
    expect(trigger).toHaveAttribute("data-state", "open");
    expect(content).toHaveAttribute("data-state", "open");
  });

  it("should set aria-expanded='true' on Trigger when defaultOpen is true", () => {
    // Arrange
    render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("should toggle Content visibility when Trigger is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    const content = screen.getByTestId("content");

    // Assert — closed initially
    expect(content).not.toBeVisible();

    // Act — open
    await user.click(trigger);

    // Assert — open after first click
    expect(content).toBeVisible();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Act — close
    await user.click(trigger);

    // Assert — closed after second click
    expect(content).not.toBeVisible();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("should start closed when defaultOpen is omitted and toggle on click", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    const content = screen.getByTestId("content");

    // Assert — closed by default
    expect(content).not.toBeVisible();

    // Act
    await user.click(trigger);

    // Assert
    expect(content).toBeVisible();
  });

  it("should call the consumer's onClick handler on Trigger in addition to toggling", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Collapsible.Root>
        <Collapsible.Trigger onClick={onClick}>Toggle</Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    const content = screen.getByTestId("content");

    // Act
    await user.click(trigger);

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(content).toBeVisible();
  });
});
