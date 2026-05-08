import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Collapsible } from "../Collapsible";

describe("Collapsible TriggerIcon tests", () => {
  it("should wrap children in a span with aria-hidden='true'", () => {
    // Arrange
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>
          Toggle
          <Collapsible.TriggerIcon data-testid="icon">
            <svg viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </Collapsible.TriggerIcon>
        </Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const icon = screen.getByTestId("icon");

    // Assert
    expect(icon.tagName).toBe("SPAN");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("should expose data-state='closed' on the wrapper when collapsed", () => {
    // Arrange
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>
          Toggle
          <Collapsible.TriggerIcon data-testid="icon">
            <svg viewBox="0 0 24 24" />
          </Collapsible.TriggerIcon>
        </Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const icon = screen.getByTestId("icon");

    // Assert
    expect(icon).toHaveAttribute("data-state", "closed");
  });

  it("should flip data-state to 'open' when the panel opens", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>
          Toggle
          <Collapsible.TriggerIcon data-testid="icon">
            <svg viewBox="0 0 24 24" />
          </Collapsible.TriggerIcon>
        </Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: /Toggle/ });
    const icon = screen.getByTestId("icon");

    // Act
    await user.click(trigger);

    // Assert
    expect(icon).toHaveAttribute("data-state", "open");
  });

  it("should hide its child icon from the accessibility tree even if the icon component sets its own aria attributes", () => {
    // Arrange — the wrapping <span aria-hidden="true"> is the source of
    // truth, so a third-party icon component that emits its own ARIA
    // surface can't leak it to AT.
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>
          Toggle
          <Collapsible.TriggerIcon>
            <span aria-label="chevron">v</span>
          </Collapsible.TriggerIcon>
        </Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );

    // Assert — only the trigger's accessible name is "Toggle"; the icon
    // is hidden from the AT tree by the wrapping span.
    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(trigger).toBeInTheDocument();
  });
});
