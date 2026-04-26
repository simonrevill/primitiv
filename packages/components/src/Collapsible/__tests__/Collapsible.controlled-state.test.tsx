import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Collapsible } from "../Collapsible";

describe("Collapsible controlled state tests", () => {
  it("should render Content visible when controlled open is true", () => {
    // Arrange
    render(
      <Collapsible.Root open onOpenChange={() => {}}>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const content = screen.getByTestId("content");

    // Assert
    expect(content).toBeVisible();
  });

  it("should render Content hidden when controlled open is false", () => {
    // Arrange
    render(
      <Collapsible.Root open={false} onOpenChange={() => {}}>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const content = screen.getByTestId("content");

    // Assert
    expect(content).not.toBeVisible();
  });

  it("should call onOpenChange with the next open value when Trigger is clicked in controlled mode", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible.Root open={false} onOpenChange={onOpenChange}>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });

    // Act
    await user.click(trigger);

    // Assert
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("should NOT internally update state in controlled mode — content visibility tracks the open prop only", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible.Root open={false} onOpenChange={onOpenChange}>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    const content = screen.getByTestId("content");

    // Act
    await user.click(trigger);

    // Assert — parent has not flipped open, so content stays hidden
    expect(content).not.toBeVisible();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("should reflect parent-driven open prop changes in DOM state", async () => {
    // Arrange
    function TestHarness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>External open</button>
          <Collapsible.Root open={open} onOpenChange={setOpen}>
            <Collapsible.Trigger>Toggle</Collapsible.Trigger>
            <Collapsible.Content data-testid="content">
              Content
            </Collapsible.Content>
          </Collapsible.Root>
        </>
      );
    }
    const user = userEvent.setup();
    render(<TestHarness />);
    const externalButton = screen.getByRole("button", { name: "External open" });
    const content = screen.getByTestId("content");

    // Assert
    expect(content).not.toBeVisible();

    // Act
    await user.click(externalButton);

    // Assert
    expect(content).toBeVisible();
  });

  it("should fire onOpenChange in uncontrolled mode when Trigger is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible.Root onOpenChange={onOpenChange}>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });

    // Act
    await user.click(trigger);

    // Assert
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);

    // Act — second toggle
    await user.click(trigger);

    // Assert
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
