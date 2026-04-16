import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Accordion } from "../Accordion";

describe("Accordion controlled state tests", () => {
  it("should render the item matching the controlled value as expanded on mount", () => {
    // Arrange
    const title1 = "Accordion Trigger 1";
    const content1 = "Accordion Content 1";
    const title2 = "Accordion Trigger 2";
    const content2 = "Accordion Content 2";
    render(
      <Accordion.Root value={["item-2"]} onValueChange={vi.fn()}>
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

    // Assert
    expect(trigger1).toHaveAttribute("aria-expanded", "false");
    expect(panel1).not.toBeVisible();
    expect(trigger2).toHaveAttribute("aria-expanded", "true");
    expect(panel2).toBeVisible();
  });

  it("should not change expanded state internally when in controlled mode", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    const title1 = "Accordion Trigger 1";
    const content1 = "Accordion Content 1";
    render(
      <Accordion.Root value={[]} onValueChange={handleValueChange}>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>{title1}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{content1}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger1 = screen.getByRole("button", { name: title1 });

    // Act
    await user.click(trigger1);

    // Assert — state unchanged internally; callback received the new value
    expect(handleValueChange).toHaveBeenCalledWith(["item-1"]);
    expect(trigger1).toHaveAttribute("aria-expanded", "false");
  });

  it("should call onValueChange with an empty array when the only expanded item is collapsed", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    const title1 = "Accordion Trigger 1";
    render(
      <Accordion.Root value={["item-1"]} onValueChange={handleValueChange}>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>{title1}</Accordion.Trigger>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger1 = screen.getByRole("button", { name: title1 });

    // Act
    await user.click(trigger1);

    // Assert
    expect(handleValueChange).toHaveBeenCalledWith([]);
  });

  it("should update the expanded panel when parent updates the controlled value", async () => {
    // Arrange
    const user = userEvent.setup();

    function ControlledAccordionParent() {
      const [expanded, setExpanded] = useState<string[]>([]);
      return (
        <Accordion.Root value={expanded} onValueChange={setExpanded}>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Header>
              <Accordion.Trigger>Trigger 2</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      );
    }

    render(<ControlledAccordionParent />);
    const trigger1 = screen.getByRole("button", { name: "Trigger 1" });
    const trigger2 = screen.getByRole("button", { name: "Trigger 2" });
    const panel1 = screen.getByText("Content 1");
    const panel2 = screen.getByText("Content 2");

    // Act — click trigger 1 to expand it
    await user.click(trigger1);

    // Assert — parent updated its state, component re-renders with new controlled value
    expect(trigger1).toHaveAttribute("aria-expanded", "true");
    expect(panel1).toBeVisible();
    expect(trigger2).toHaveAttribute("aria-expanded", "false");
    expect(panel2).not.toBeVisible();
  });

  it("should keep multiple items expanded when using controlled value in multiple mode", async () => {
    // Arrange
    const user = userEvent.setup();
    const title1 = "Accordion Trigger 1";
    const content1 = "Accordion Content 1";
    const title2 = "Accordion Trigger 2";
    const content2 = "Accordion Content 2";

    function ControlledMultipleAccordion() {
      const [expanded, setExpanded] = useState<string[]>([]);
      return (
        <Accordion.Root multiple value={expanded} onValueChange={setExpanded}>
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
        </Accordion.Root>
      );
    }

    render(<ControlledMultipleAccordion />);
    const trigger1 = screen.getByRole("button", { name: title1 });
    const trigger2 = screen.getByRole("button", { name: title2 });
    const panel1 = screen.getByText(content1);
    const panel2 = screen.getByText(content2);

    // Act — expand both
    await user.click(trigger1);
    await user.click(trigger2);

    // Assert — both remain expanded in multiple mode
    expect(panel1).toBeVisible();
    expect(panel2).toBeVisible();
  });
});
