import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Accordion } from "../Accordion";

describe("Accordion data attributes tests", () => {
  it('should apply data-state="closed" to accordion item trigger by default', () => {
    // Arrange
    const title = "Accordion Trigger 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>{title}</Accordion.Trigger>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const accordionItemTrigger = screen.getByRole("button", { name: title });

    // Assert
    expect(accordionItemTrigger).toHaveAttribute("data-state", "closed");
  });

  it('should apply data-state="open" to accordion item trigger when expanded', async () => {
    // Arrange
    const user = userEvent.setup();
    const title = "Accordion Trigger 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>{title}</Accordion.Trigger>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const accordionItemTrigger = screen.getByRole("button", { name: title });

    // Act
    await user.click(accordionItemTrigger);

    // Assert
    expect(accordionItemTrigger).toHaveAttribute("data-state", "open");
  });

  it('should apply data-state="closed" to accordion item content panel by default', () => {
    // Arrange
    const title = "Accordion Trigger 1";
    const content = "Accordion Content 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>{title}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const accordionItemPanel = screen.getByText(content);

    // Assert
    expect(accordionItemPanel).toHaveAttribute("data-state", "closed");
  });

  it('should apply data-state="open" to accordion item content panel when expanded', async () => {
    // Arrange
    const user = userEvent.setup();
    const title = "Accordion Trigger 1";
    const content = "Accordion Content 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>{title}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const accordionItemTrigger = screen.getByRole("button", { name: title });
    const accordionItemPanel = screen.getByText(content);

    // Act
    await user.click(accordionItemTrigger);

    // Assert
    expect(accordionItemPanel).toHaveAttribute("data-state", "open");
  });

  it('should apply data-state="closed" to accordion trigger icon by default', () => {
    // Arrange
    const title = "Accordion Trigger 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>
              {title}
              <Accordion.TriggerIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </Accordion.TriggerIcon>
            </Accordion.Trigger>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const accordionItemTrigger = screen.getByRole("button", { name: title });
    const accordionItemTriggerIcon = accordionItemTrigger.querySelector("svg");

    // Assert
    expect(accordionItemTriggerIcon).toHaveAttribute("data-state", "closed");
  });

  it('should apply data-state="open" to accordion trigger icon when expanded', async () => {
    // Arrange
    const user = userEvent.setup();
    const title = "Accordion Trigger 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>
              {title}
              <Accordion.TriggerIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </Accordion.TriggerIcon>
            </Accordion.Trigger>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const accordionItemTrigger = screen.getByRole("button", { name: title });
    const accordionItemTriggerIcon = accordionItemTrigger.querySelector("svg");

    // Act
    await user.click(accordionItemTrigger);

    // Assert
    expect(accordionItemTriggerIcon).toHaveAttribute("data-state", "open");
  });
});
