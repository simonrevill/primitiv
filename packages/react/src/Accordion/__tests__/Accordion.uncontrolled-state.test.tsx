import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Accordion } from "../Accordion";

describe("Accordion uncontrolled state tests", () => {
  it("should render first accordion item panel as expanded when using defaultValue with item value prop", () => {
    // Arrange
    const title1 = "Accordion Trigger 1";
    const content1 = "Accordion Content 1";
    const title2 = "Accordion Trigger 2";
    const content2 = "Accordion Content 2";

    render(
      <Accordion.Root defaultValue="item-1">
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>{title1}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content1}</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header>
            <Accordion.Trigger>{title2}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content2}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger1 = screen.getByRole("button", { name: title1 });
    const accordionItemPanel1 = screen.getByText(content1);

    // Assert - Item 1 should be expanded by default
    expect(trigger1).toHaveAttribute("aria-expanded", "true");
    expect(accordionItemPanel1).toBeVisible();
  });

  it("should handle defaultValue when explicitly set to undefined", async () => {
    // Arrange
    const user = userEvent.setup();
    const title1 = "Accordion Trigger 1";
    const title2 = "Accordion Trigger 2";
    const content1 = "Accordion Content 1.";
    const content2 = "Cars can be expensive.";

    render(
      <Accordion.Root defaultValue={undefined}>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>{title1}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content1}</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header>
            <Accordion.Trigger>{title2}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content2}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger1 = screen.getByRole("button", { name: title1 });
    const trigger2 = screen.getByRole("button", { name: title2 });
    const panel1 = screen.getByText(content1);
    const panel2 = screen.getByText(content2);

    // Assert - No items should be expanded
    expect(trigger1).toHaveAttribute("aria-expanded", "false");
    expect(trigger2).toHaveAttribute("aria-expanded", "false");
    expect(panel1).not.toBeVisible();
    expect(panel2).not.toBeVisible();

    // Verify both can be expanded independently (proving Set is truly empty)
    await user.click(trigger1);
    expect(trigger1).toHaveAttribute("aria-expanded", "true");
    expect(panel1).toBeVisible();
    expect(trigger2).toHaveAttribute("aria-expanded", "false");
    expect(panel2).not.toBeVisible();

    await user.click(trigger2);
    expect(trigger1).toHaveAttribute("aria-expanded", "false");
    expect(panel1).not.toBeVisible();
    expect(trigger2).toHaveAttribute("aria-expanded", "true");
    expect(panel2).toBeVisible();
  });

  it("should update toggleItem behavior when multiple prop changes", async () => {
    // Arrange
    const user = userEvent.setup();
    const title1 = "Item 1";
    const title2 = "Item 2";
    const content1 = "Content 1";
    const content2 = "Content 2";

    const { rerender } = render(
      <Accordion.Root multiple={false}>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>{title1}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content1}</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header>
            <Accordion.Trigger>{title2}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content2}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger1 = screen.getByRole("button", { name: title1 });
    const trigger2 = screen.getByRole("button", { name: title2 });
    const panel1 = screen.getByText(content1);
    const panel2 = screen.getByText(content2);

    // Act - In single mode, clicking second trigger should close first
    await user.click(trigger1);
    expect(trigger1).toHaveAttribute("aria-expanded", "true");
    expect(panel1).toBeVisible();

    await user.click(trigger2);
    expect(trigger1).toHaveAttribute("aria-expanded", "false");
    expect(panel1).not.toBeVisible();
    expect(trigger2).toHaveAttribute("aria-expanded", "true");
    expect(panel2).toBeVisible();

    // Act - Change to multiple mode
    rerender(
      <Accordion.Root multiple>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>{title1}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content1}</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header>
            <Accordion.Trigger>{title2}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content2}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    // Assert - In multiple mode, both can be open at once
    await user.click(trigger1);
    expect(trigger1).toHaveAttribute("aria-expanded", "true");
    expect(panel1).toBeVisible();
    expect(trigger2).toHaveAttribute("aria-expanded", "true");
    expect(panel2).toBeVisible();
  });
});
