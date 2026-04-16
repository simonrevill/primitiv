import { render, screen } from "@testing-library/react";

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
