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
          <Accordion.Content>Content</Accordion.Content>
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
          <Accordion.Content>Content</Accordion.Content>
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

  it('should apply data-state="closed" to accordion trigger icon wrapper by default', () => {
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
          <Accordion.Content>Content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const accordionItemTrigger = screen.getByRole("button", { name: title });
    const iconWrapper = accordionItemTrigger.querySelector("[aria-hidden='true']");

    // Assert
    expect(iconWrapper).toHaveAttribute("data-state", "closed");
  });

  it('should apply data-state="open" to accordion trigger icon wrapper when expanded', async () => {
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
          <Accordion.Content>Content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const accordionItemTrigger = screen.getByRole("button", { name: title });
    const iconWrapper = accordionItemTrigger.querySelector("[aria-hidden='true']");

    // Act
    await user.click(accordionItemTrigger);

    // Assert
    expect(iconWrapper).toHaveAttribute("data-state", "open");
  });

  it('should apply data-state="closed" to the icon wrapper when the icon is a React component', () => {
    // Arrange — simulates lucide-react, react-icons, or any custom icon component
    const ComponentIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M5 12h14" />
      </svg>
    );
    const title = "Accordion Trigger 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>
              {title}
              <Accordion.TriggerIcon>
                <ComponentIcon />
              </Accordion.TriggerIcon>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger = screen.getByRole("button", { name: title });
    const iconWrapper = trigger.querySelector("[aria-hidden='true']");

    // Assert
    expect(iconWrapper).not.toBeNull();
    expect(iconWrapper).toHaveAttribute("data-state", "closed");
  });

  it('should apply data-state="open" to the icon wrapper when the icon is a React component and the item is expanded', async () => {
    // Arrange
    const user = userEvent.setup();
    const ComponentIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M5 12h14" />
      </svg>
    );
    const title = "Accordion Trigger 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>
              {title}
              <Accordion.TriggerIcon>
                <ComponentIcon />
              </Accordion.TriggerIcon>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger = screen.getByRole("button", { name: title });

    // Act
    await user.click(trigger);

    // Assert
    const iconWrapper = trigger.querySelector("[aria-hidden='true']");
    expect(iconWrapper).toHaveAttribute("data-state", "open");
  });

  it("should forward arbitrary props to the trigger icon wrapper span", () => {
    // Arrange
    const title = "Accordion Trigger 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>
              {title}
              <Accordion.TriggerIcon
                className="custom-icon"
                data-testid="icon"
                data-custom="x"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14" />
                </svg>
              </Accordion.TriggerIcon>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const iconWrapper = screen.getByTestId("icon");

    // Assert — forwarded props land on the span without clobbering its own hooks
    expect(iconWrapper.tagName).toBe("SPAN");
    expect(iconWrapper).toHaveClass("custom-icon");
    expect(iconWrapper).toHaveAttribute("data-custom", "x");
    expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
    expect(iconWrapper).toHaveAttribute("data-state", "closed");
  });
});
