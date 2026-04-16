import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Accordion } from "../Accordion";

describe("Accordion mouse interaction tests", () => {
  it('should apply aria-expanded="true" attribute to accordion item trigger when clicking on a collapsed one', async () => {
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
    expect(accordionItemTrigger).toHaveAttribute("aria-expanded", "true");
  });

  it("should not make accordion item content panel visible when a different accordion item trigger is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const title1 = "Accordion Trigger 1";
    const title2 = "Accordion Trigger 2";
    const content1 = "Accordion Content 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>{title1}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content1}</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>{title2}</Accordion.Trigger>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const accordionItemPanel = screen.getByText(content1);
    const accordionItemTrigger2 = screen.getByRole("button", {
      name: title2,
    });

    // Act
    await user.click(accordionItemTrigger2);

    // Assert
    expect(accordionItemPanel).not.toBeVisible();
  });

  it("should make accordion item content panel visible when accordion item trigger is clicked", async () => {
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
    expect(accordionItemPanel).toBeVisible();
  });

  it("should remove the hidden attribute from an accordion item content panel when the associated accordion item trigger is clicked", async () => {
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
    expect(accordionItemPanel).not.toHaveAttribute("hidden");
  });

  it('should apply aria-expanded="false" attribute to accordion item trigger when clicking on an expanded one', async () => {
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
    await user.click(accordionItemTrigger);

    // Assert
    expect(accordionItemTrigger).toHaveAttribute("aria-expanded", "false");
  });

  it('should apply aria-expanded="true" attribute to accordion item trigger when re-expanding a collapsed one', async () => {
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
    await user.click(accordionItemTrigger);
    await user.click(accordionItemTrigger);

    // Assert
    expect(accordionItemTrigger).toHaveAttribute("aria-expanded", "true");
  });

  it("should make accordion item content panel not visible when an expanded accordion item trigger is clicked", async () => {
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
    await user.click(accordionItemTrigger);

    // Assert
    expect(accordionItemPanel).not.toBeVisible();
  });

  it("should call the onClick handler when provided to AccordionTrigger", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    const title = "Accordion Trigger 1";
    render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger onClick={onClick}>{title}</Accordion.Trigger>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const accordionItemTrigger = screen.getByRole("button", { name: title });

    // Act
    await user.click(accordionItemTrigger);

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
