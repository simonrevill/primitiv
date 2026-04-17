import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Accordion } from "../Accordion";

describe("Accordion forceMount tests", () => {
  it("should keep the panel in the DOM when forceMount is true and the panel is closed", () => {
    // Arrange
    const content = "Accordion Content 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content forceMount>{content}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    // Assert — panel is in the DOM even when closed
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it("should NOT apply the hidden attribute when forceMount is true and the panel is closed", () => {
    // Arrange
    const content = "Accordion Content 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content forceMount>{content}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    // Assert
    expect(screen.getByText(content)).not.toHaveAttribute("hidden");
  });

  it("should apply aria-hidden='true' when forceMount is true and the panel is closed", () => {
    // Arrange
    const content = "Accordion Content 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content forceMount>{content}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    // Assert — aria-hidden hides closed panel from AT when forceMount keeps it in DOM
    expect(screen.getByText(content)).toHaveAttribute("aria-hidden", "true");
  });

  it("should NOT apply aria-hidden when forceMount is true and the panel is open", async () => {
    // Arrange
    const user = userEvent.setup();
    const content = "Accordion Content 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content forceMount>{content}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger 1" });

    // Act — open the panel
    await user.click(trigger);

    // Assert — aria-hidden removed when panel is open
    expect(screen.getByText(content)).not.toHaveAttribute("aria-hidden");
  });

  it("should NOT apply aria-hidden when forceMount is false and the panel is closed", () => {
    // Arrange
    const content = "Accordion Content 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    // Assert — standard hidden panel uses HTML hidden attribute, not aria-hidden
    expect(screen.getByText(content)).not.toHaveAttribute("aria-hidden");
  });

  it("should apply data-state='closed' when forceMount is true and the panel is closed", () => {
    // Arrange
    const content = "Accordion Content 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content forceMount>{content}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    // Assert
    expect(screen.getByText(content)).toHaveAttribute("data-state", "closed");
  });
});
