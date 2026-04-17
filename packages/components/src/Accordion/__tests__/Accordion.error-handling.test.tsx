import { render } from "@testing-library/react";

import { Accordion } from "../Accordion";

const PlusIcon = () => (
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
    className="lucide lucide-plus-icon lucide-plus"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

describe("Accordion error handling tests", () => {
  it("should throw an error when AccordionHeader is used outside AccordionRoot", () => {
    // Arrange & Act & Assert
    expect(() => {
      render(<Accordion.Header>Test</Accordion.Header>);
    }).toThrow("AccordionHeader must be used within AccordionRoot");
  });

  it("should throw an error when AccordionItem is used outside AccordionRoot", () => {
    // Arrange & Act & Assert
    expect(() => {
      render(
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>Test</Accordion.Trigger>
          </Accordion.Header>
        </Accordion.Item>,
      );
    }).toThrow("AccordionItem must be used within AccordionRoot");
  });

  it("should throw an error when AccordionTrigger is used outside AccordionItem", () => {
    // Arrange & Act & Assert
    expect(() => {
      render(
        <Accordion.Root>
          <Accordion.Trigger>Test</Accordion.Trigger>
        </Accordion.Root>,
      );
    }).toThrow("Component must be used within AccordionItem");
  });

  it("should throw an error when AccordionContent is used outside AccordionItem", () => {
    // Arrange & Act & Assert
    expect(() => {
      render(
        <Accordion.Root>
          <Accordion.Content>Test content</Accordion.Content>
        </Accordion.Root>,
      );
    }).toThrow("Component must be used within AccordionItem");
  });

  it("should throw an error when AccordionTriggerIcon is used outside AccordionItem", () => {
    // Arrange & Act & Assert
    expect(() => {
      render(
        <Accordion.Root>
          <Accordion.TriggerIcon>
            <PlusIcon />
          </Accordion.TriggerIcon>
        </Accordion.Root>,
      );
    }).toThrow("Component must be used within AccordionItem");
  });

  it("should throw in development when AccordionTrigger has no corresponding AccordionContent", () => {
    // Arrange & Act & Assert
    expect(() => {
      render(
        <Accordion.Root>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>Trigger without content</Accordion.Trigger>
            </Accordion.Header>
            {/* No AccordionContent */}
          </Accordion.Item>
        </Accordion.Root>,
      );
    }).toThrow(/AccordionTrigger.*no corresponding AccordionContent/);
  });

  it("should not throw when AccordionItem with Trigger and Content is added dynamically", () => {
    // Arrange
    function DynamicAccordion({ showItem }: { showItem: boolean }) {
      return (
        <Accordion.Root>
          {showItem && (
            <Accordion.Item value="item-1">
              <Accordion.Header>
                <Accordion.Trigger>Dynamic Trigger</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>Dynamic Content</Accordion.Content>
            </Accordion.Item>
          )}
        </Accordion.Root>
      );
    }

    const { rerender } = render(<DynamicAccordion showItem={false} />);

    // Act & Assert — adding both trigger and content together must not throw
    expect(() => {
      rerender(<DynamicAccordion showItem={true} />);
    }).not.toThrow();
  });
});
