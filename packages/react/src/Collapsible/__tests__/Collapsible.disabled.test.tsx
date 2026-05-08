import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Collapsible } from "../Collapsible";

describe("Collapsible disabled tests", () => {
  it("should set aria-disabled='true' and data-disabled='true' on Trigger when Root is disabled", () => {
    // Arrange
    render(
      <Collapsible.Root disabled>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });

    // Assert
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    expect(trigger).toHaveAttribute("data-disabled", "true");
  });

  it("should NOT set aria-disabled when Root is not disabled", () => {
    // Arrange
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });

    // Assert — Trigger renders the literal string "false" so consumers can
    // hook on [data-disabled="false"] if they want; aria-disabled is only
    // set when actually disabled.
    expect(trigger).not.toHaveAttribute("aria-disabled");
    expect(trigger).toHaveAttribute("data-disabled", "false");
  });

  it("should set data-disabled='true' on Root and Content when disabled", () => {
    // Arrange
    render(
      <Collapsible.Root disabled data-testid="test-collapsible">
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const root = screen.getByTestId("test-collapsible");
    const content = screen.getByTestId("content");

    // Assert
    expect(root).toHaveAttribute("data-disabled", "true");
    expect(content).toHaveAttribute("data-disabled", "true");
  });

  it("should remain focusable when disabled (aria-disabled, not native disabled)", () => {
    // Arrange
    render(
      <Collapsible.Root disabled>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });

    // Act
    trigger.focus();

    // Assert
    expect(trigger).toHaveFocus();
    expect(trigger).not.toHaveAttribute("disabled");
  });

  it("should NOT toggle when a disabled Trigger is clicked (uncontrolled)", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Collapsible.Root disabled>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    const content = screen.getByTestId("content");

    // Act
    await user.click(trigger);

    // Assert
    expect(content).not.toBeVisible();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("should NOT fire onOpenChange when a disabled Trigger is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible.Root disabled onOpenChange={onOpenChange}>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });

    // Act
    await user.click(trigger);

    // Assert
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("should NOT call the consumer's onClick when a disabled Trigger is clicked", async () => {
    // Arrange — matches Accordion's behaviour: a disabled Trigger short-
    // circuits the click handler entirely (no toggle, no consumer onClick),
    // since aria-disabled means the control is inoperative.
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Collapsible.Root disabled>
        <Collapsible.Trigger onClick={onClick}>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });

    // Act
    await user.click(trigger);

    // Assert
    expect(onClick).not.toHaveBeenCalled();
  });
});
