import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Accordion } from "../Accordion";

describe("Accordion multiple mode tests", () => {
  it("should keep both panels open when multiple={true} and both triggers are clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const title1 = "Accordion Trigger 1";
    const content1 = "Accordion Content 1";
    const title2 = "Accordion Trigger 2";
    const content2 = "Accordion Content 2";
    render(
      <Accordion.Root multiple>
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
          <Accordion.Content>{content2}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const accordionItemTrigger1 = screen.getByRole("button", {
      name: title1,
    });
    const accordionItemTrigger2 = screen.getByRole("button", {
      name: title2,
    });
    const accordionItemPanel1 = screen.getByText(content1);
    const accordionItemPanel2 = screen.getByText(content2);

    // Act
    await user.click(accordionItemTrigger1);
    await user.click(accordionItemTrigger2);

    // Assert - Both panels should be visible in multiple mode
    expect(accordionItemPanel1).toBeVisible();
    expect(accordionItemPanel2).toBeVisible();
  });

  it("should close both panels when multiple={true} and both triggers are clicked twice", async () => {
    // Arrange
    const user = userEvent.setup();
    const title1 = "Accordion Trigger 1";
    const content1 = "Accordion Content 1";
    const title2 = "Accordion Trigger 2";
    const content2 = "Accordion Content 2";
    render(
      <Accordion.Root multiple>
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
          <Accordion.Content>{content2}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const accordionItemTrigger1 = screen.getByRole("button", {
      name: title1,
    });
    const accordionItemTrigger2 = screen.getByRole("button", {
      name: title2,
    });
    const accordionItemPanel1 = screen.getByText(content1);
    const accordionItemPanel2 = screen.getByText(content2);

    // Act - Open both, then close both
    await user.click(accordionItemTrigger1);
    await user.click(accordionItemTrigger2);
    await user.click(accordionItemTrigger1);
    await user.click(accordionItemTrigger2);

    // Assert - Both panels should be closed
    expect(accordionItemPanel1).not.toBeVisible();
    expect(accordionItemPanel2).not.toBeVisible();
  });
});
