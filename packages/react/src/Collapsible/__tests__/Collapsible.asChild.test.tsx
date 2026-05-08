import { useRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Collapsible } from "../Collapsible";

describe("Collapsible asChild and keyboard tests", () => {
  it("should render the child element (not a button) when Trigger uses asChild", () => {
    // Arrange
    render(
      <Collapsible.Root>
        <Collapsible.Trigger asChild>
          <a href="#anchor" data-testid="trigger">
            Toggle
          </a>
        </Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByTestId("trigger");

    // Assert — rendered element is the anchor; no wrapping button
    expect(trigger.tagName).toBe("A");
    expect(trigger).toHaveAttribute("href", "#anchor");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("should merge ARIA attributes from Trigger onto the child element", () => {
    // Arrange
    render(
      <Collapsible.Root>
        <Collapsible.Trigger asChild>
          <a href="#anchor" data-testid="trigger">
            Toggle
          </a>
        </Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByTestId("trigger");
    const content = screen.getByTestId("content");

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls", content.id);
    expect(trigger).toHaveAttribute("data-state", "closed");
  });

  it("should compose onClick: child handler runs alongside the internal toggle", async () => {
    // Arrange
    const user = userEvent.setup();
    const childOnClick = vi.fn();
    render(
      <Collapsible.Root>
        <Collapsible.Trigger asChild>
          <a href="#anchor" data-testid="trigger" onClick={childOnClick}>
            Toggle
          </a>
        </Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByTestId("trigger");
    const content = screen.getByTestId("content");

    // Act
    await user.click(trigger);

    // Assert — both ran, content is now open
    expect(childOnClick).toHaveBeenCalledTimes(1);
    expect(content).toBeVisible();
  });

  it("should toggle on Enter when asChild renders a non-button element", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Collapsible.Root>
        <Collapsible.Trigger asChild>
          <a href="#anchor" data-testid="trigger">
            Toggle
          </a>
        </Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByTestId("trigger");
    const content = screen.getByTestId("content");

    // Act
    trigger.focus();
    await user.keyboard("{Enter}");

    // Assert
    expect(content).toBeVisible();
  });

  it("should toggle on Space when asChild renders a non-button element", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Collapsible.Root>
        <Collapsible.Trigger asChild>
          <a href="#anchor" data-testid="trigger">
            Toggle
          </a>
        </Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByTestId("trigger");
    const content = screen.getByTestId("content");

    // Act
    trigger.focus();
    await user.keyboard(" ");

    // Assert
    expect(content).toBeVisible();
  });

  it("should NOT toggle on Enter or Space when disabled (asChild)", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Collapsible.Root disabled>
        <Collapsible.Trigger asChild>
          <a href="#anchor" data-testid="trigger">
            Toggle
          </a>
        </Collapsible.Trigger>
        <Collapsible.Content data-testid="content">Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByTestId("trigger");
    const content = screen.getByTestId("content");

    // Act
    trigger.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    // Assert
    expect(content).not.toBeVisible();
  });

  it("should auto-inject role='button' when asChild is combined with disabled", () => {
    // Arrange — aria-disabled on a non-button element has no defined ARIA
    // semantics; role="button" makes the attribute meaningful for AT.
    render(
      <Collapsible.Root disabled>
        <Collapsible.Trigger asChild>
          <a href="#anchor" data-testid="trigger">
            Toggle
          </a>
        </Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByTestId("trigger");

    // Assert
    expect(trigger).toHaveAttribute("role", "button");
    expect(trigger).toHaveAttribute("aria-disabled", "true");
  });

  it("should NOT inject role='button' when asChild without disabled", () => {
    // Arrange
    render(
      <Collapsible.Root>
        <Collapsible.Trigger asChild>
          <a href="#anchor" data-testid="trigger">
            Toggle
          </a>
        </Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByTestId("trigger");

    // Assert — no role override means the anchor stays a link
    expect(trigger).not.toHaveAttribute("role");
  });

  it("should forward a consumer-supplied ref to the asChild element", () => {
    // Arrange
    function TestHarness() {
      const ref = useRef<HTMLAnchorElement>(null);
      return (
        <>
          <button onClick={() => ref.current?.setAttribute("data-touched", "yes")}>
            Touch
          </button>
          <Collapsible.Root>
            <Collapsible.Trigger<HTMLAnchorElement> asChild ref={ref}>
              <a href="#anchor" data-testid="trigger">
                Toggle
              </a>
            </Collapsible.Trigger>
            <Collapsible.Content>Content</Collapsible.Content>
          </Collapsible.Root>
        </>
      );
    }
    render(<TestHarness />);
    const touch = screen.getByRole("button", { name: "Touch" });
    const trigger = screen.getByTestId("trigger");

    // Act
    touch.click();

    // Assert
    expect(trigger).toHaveAttribute("data-touched", "yes");
  });

  it("should forward a consumer-supplied ref to the default <button> when asChild is not used", () => {
    // Arrange
    function TestHarness() {
      const ref = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button onClick={() => ref.current?.setAttribute("data-touched", "yes")}>
            Touch
          </button>
          <Collapsible.Root>
            <Collapsible.Trigger ref={ref}>Toggle</Collapsible.Trigger>
            <Collapsible.Content>Content</Collapsible.Content>
          </Collapsible.Root>
        </>
      );
    }
    render(<TestHarness />);
    const touch = screen.getByRole("button", { name: "Touch" });
    const trigger = screen.getByRole("button", { name: "Toggle" });

    // Assert
    touch.click();
    expect(trigger).toHaveAttribute("data-touched", "yes");
  });
});
