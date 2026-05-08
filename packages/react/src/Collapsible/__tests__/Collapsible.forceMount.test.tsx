import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Collapsible } from "../Collapsible";

describe("Collapsible forceMount tests", () => {
  it("should NOT set the hidden attribute on Content when forceMount is true and the panel is closed", () => {
    // Arrange
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content forceMount data-testid="content">
          Content
        </Collapsible.Content>
      </Collapsible.Root>,
    );
    const content = screen.getByTestId("content");

    // Assert
    expect(content).not.toHaveAttribute("hidden");
  });

  it("should keep Content present in the DOM when forceMount is true and the panel is closed", () => {
    // Arrange
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content forceMount data-testid="content">
          Content
        </Collapsible.Content>
      </Collapsible.Root>,
    );
    const content = screen.getByTestId("content");

    // Assert — element exists, just visually hidden via CSS
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute("data-state", "closed");
  });

  it("should set aria-hidden='true' on closed Content when forceMount is true", () => {
    // Arrange
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content forceMount data-testid="content">
          Content
        </Collapsible.Content>
      </Collapsible.Root>,
    );
    const content = screen.getByTestId("content");

    // Assert
    expect(content).toHaveAttribute("aria-hidden", "true");
  });

  it("should remove aria-hidden when Content opens under forceMount", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content forceMount data-testid="content">
          Content
        </Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    const content = screen.getByTestId("content");

    // Act
    await user.click(trigger);

    // Assert
    expect(content).not.toHaveAttribute("aria-hidden");
    expect(content).toHaveAttribute("data-state", "open");
  });

  it("should let consumers override the auto aria-hidden via an explicit aria-hidden prop", () => {
    // Arrange
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content
          forceMount
          aria-hidden={false}
          data-testid="content"
        >
          Content
        </Collapsible.Content>
      </Collapsible.Root>,
    );
    const content = screen.getByTestId("content");

    // Assert — explicit consumer prop wins because rest is spread after
    expect(content).toHaveAttribute("aria-hidden", "false");
  });

  it("should still apply hidden by default (without forceMount) when closed", () => {
    // Arrange
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const content = screen.getByTestId("content");

    // Assert
    expect(content).toHaveAttribute("hidden");
  });
});
