import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Accordion } from "../Accordion";
import { type HeadingLevel } from "../../types";

describe("accordion tests", () => {
  describe("default accordion item rendering", () => {
    it('should apply the attribute data-orientation="vertical" to the accordion by default', () => {
      // Arrange
      render(<Accordion.Root data-testid="test-accordion" />);
      const accordion = screen.getByTestId("test-accordion");

      // Assert
      expect(accordion).toHaveAttribute("data-orientation", "vertical");
    });

    it('should apply the attribute data-orientation="horizontal" to the accordion when orientation="horizontal" is provided', () => {
      // Arrange
      render(
        <Accordion.Root
          data-testid="test-accordion"
          orientation="horizontal"
        />,
      );
      const accordion = screen.getByTestId("test-accordion");

      // Assert
      expect(accordion).toHaveAttribute("data-orientation", "horizontal");
    });

    it('should apply the attribute aria-expanded="false" to the accordion item trigger by default', () => {
      // Arrange
      const title = "Accordion Trigger 1";
      render(
        <Accordion.Root data-testid="test-accordion">
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemTrigger = screen.getByRole("button", { name: title });

      // Assert
      expect(accordionItemTrigger).toHaveAttribute("aria-expanded", "false");
    });

    it("should give the accordion item trigger a unique id", () => {
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
      expect(accordionItemTrigger).toHaveAttribute(
        "id",
        expect.stringContaining("-heading-"),
      );
    });

    it('should apply the correct "aria-controls" attribute to the accordion item trigger button', () => {
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
      expect(accordionItemTrigger).toHaveAttribute(
        "aria-controls",
        expect.stringContaining("-panel-"),
      );
    });

    it('should apply the aria-hidden="true" attribute to the accordion trigger icon', () => {
      // Arrange
      const title = "Accordion Trigger 1";
      render(
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>
                {title}
                <Accordion.TriggerIcon
                  icon={
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
                  }
                />
              </Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemTrigger = screen.getByRole("button", { name: title });
      const accordionItemTriggerIcon =
        accordionItemTrigger.querySelector("svg");

      // Assert
      expect(accordionItemTriggerIcon).toHaveAttribute("aria-hidden", "true");
    });

    it("should give the accordion item content panel a unique id", () => {
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
      expect(accordionItemPanel).toHaveAttribute(
        "id",
        expect.stringContaining("-panel-"),
      );
    });

    it('should apply the correct "aria-labelledby" attribute to the accordion item content panel', () => {
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
      expect(accordionItemPanel).toHaveAttribute(
        "aria-labelledby",
        expect.stringContaining("-heading-"),
      );
    });

    it('should apply the attribute role="region" to the accordion item content panel', () => {
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
      expect(accordionItemPanel).toHaveAttribute("role", "region");
    });

    it("accordion item content panel should not be visible by default", () => {
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
      expect(accordionItemPanel).not.toBeVisible();
    });

    it("accordion item content panel should have a hidden attribute by default", () => {
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
      expect(accordionItemPanel).toHaveAttribute("hidden");
    });

    it("should render the accordion header as an h3 element by default", () => {
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
      const accordionHeader = accordionItemTrigger.parentElement;

      // Assert
      expect(accordionHeader?.tagName).toBe("H3");
    });

    it.each([
      { level: 1 as HeadingLevel },
      { level: 2 as HeadingLevel },
      { level: 3 as HeadingLevel },
      { level: 4 as HeadingLevel },
      { level: 5 as HeadingLevel },
      { level: 6 as HeadingLevel },
    ])(
      "should render the accordion header as an h$level element when level=$level is provided",
      ({ level }) => {
        // Arrange
        const title = "Accordion Trigger 1";
        render(
          <Accordion.Root>
            <Accordion.Item>
              <Accordion.Header level={level}>
                <Accordion.Trigger>{title}</Accordion.Trigger>
              </Accordion.Header>
            </Accordion.Item>
          </Accordion.Root>,
        );
        const accordionItemTrigger = screen.getByRole("button", {
          name: title,
        });
        const accordionHeader = accordionItemTrigger.parentElement;

        // Assert
        expect(accordionHeader?.tagName).toBe(`H${level}`);
      },
    );
  });

  describe("mouse interaction", () => {
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

  describe("context errors", () => {
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
            <Accordion.TriggerIcon
              icon={
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
              }
            />
          </Accordion.Root>,
        );
      }).toThrow("Component must be used within AccordionItem");
    });
  });

  describe("data attributes for styling", () => {
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
                <Accordion.TriggerIcon
                  icon={
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
                  }
                />
              </Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemTrigger = screen.getByRole("button", { name: title });
      const accordionItemTriggerIcon =
        accordionItemTrigger.querySelector("svg");

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
                <Accordion.TriggerIcon
                  icon={
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
                  }
                />
              </Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemTrigger = screen.getByRole("button", { name: title });
      const accordionItemTriggerIcon =
        accordionItemTrigger.querySelector("svg");

      // Act
      await user.click(accordionItemTrigger);

      // Assert
      expect(accordionItemTriggerIcon).toHaveAttribute("data-state", "open");
    });
  });

  describe("keyboard interaction", () => {
    it('should expand a closed accordion item panel when focus is on the accordion trigger and the "Enter" key is pressed', async () => {
      // Arrange
      const user = userEvent.setup();
      const title1 = "Accordion Trigger 1";
      const content1 = "Accordion Content 1";
      const title2 = "Accordion Trigger 2";
      const content2 = "Accordion Content 2";
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
            <Accordion.Content>{content2}</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemPanel1 = screen.getByText(content1);

      // Act
      await user.tab();
      await user.keyboard("[Enter]");

      // Assert
      expect(accordionItemPanel1).toBeVisible();
    });

    it('should expand a closed accordion item panel when focus is on the accordion trigger and the "Space" key is pressed', async () => {
      // Arrange
      const user = userEvent.setup();
      const title1 = "Accordion Trigger 1";
      const content1 = "Accordion Content 1";
      const title2 = "Accordion Trigger 2";
      const content2 = "Accordion Content 2";
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
            <Accordion.Content>{content2}</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemPanel1 = screen.getByText(content1);

      // Act
      await user.tab();
      await user.keyboard("[Space]");

      // Assert
      expect(accordionItemPanel1).toBeVisible();
    });

    it('should collapse an existing expanded accordion item panel when focus is on the accordion trigger and the "Enter" key is pressed', async () => {
      // Arrange
      const user = userEvent.setup();
      const title1 = "Accordion Trigger 1";
      const content1 = "Accordion Content 1";
      const title2 = "Accordion Trigger 2";
      const content2 = "Accordion Content 2";
      const title3 = "Accordion Trigger 3";
      const content3 = "Accordion Content 3";
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
            <Accordion.Content>{content2}</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title3}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>{content3}</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemPanel3 = screen.getByText(content3);

      // Act - Tab to item 3 and expand it:
      await user.tab();
      await user.tab();
      await user.tab();
      await user.keyboard("[Enter]");

      // Tab back to item 1 and expand it (should close item 3 in single mode):
      await user.tab({ shift: true });
      await user.tab({ shift: true });
      await user.keyboard("[Enter]");

      // Assert - Panel 3 should be closed because we're in single mode
      expect(accordionItemPanel3).not.toBeVisible();
    });

    it('should collapse an existing expanded accordion item panel when focus is on the accordion trigger and the "Space" key is pressed', async () => {
      // Arrange
      const user = userEvent.setup();
      const title1 = "Accordion Trigger 1";
      const content1 = "Accordion Content 1";
      const title2 = "Accordion Trigger 2";
      const content2 = "Accordion Content 2";
      const title3 = "Accordion Trigger 3";
      const content3 = "Accordion Content 3";
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
            <Accordion.Content>{content2}</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title3}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>{content3}</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemPanel3 = screen.getByText(content3);

      // Act - Tab to item 3 and expand it:
      await user.tab();
      await user.tab();
      await user.tab();
      await user.keyboard("[Space]");

      // Tab back to item 1 and expand it (should close item 3 in single mode):
      await user.tab({ shift: true });
      await user.tab({ shift: true });
      await user.keyboard("[Space]");

      // Assert - Panel 3 should be closed because we're in single mode
      expect(accordionItemPanel3).not.toBeVisible();
    });

    it('should move focus to the next accordion trigger when focus is on an accordion trigger and the "ArrowDown" key is pressed', async () => {
      // Arrange
      const user = userEvent.setup();
      const title1 = "Accordion Trigger 1";
      const title2 = "Accordion Trigger 2";
      const title3 = "Accordion Trigger 3";
      render(
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title1}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title2}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title3}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemTrigger2 = screen.getByRole("button", {
        name: title2,
      });

      // Act
      await user.tab();
      await user.keyboard("[ArrowDown]");

      // Assert
      expect(accordionItemTrigger2).toHaveFocus();
    });

    it('should move focus to the previous accordion trigger when focus is on an accordion trigger and the "ArrowUp" key is pressed', async () => {
      // Arrange
      const user = userEvent.setup();
      const title1 = "Accordion Trigger 1";
      const title2 = "Accordion Trigger 2";
      const title3 = "Accordion Trigger 3";
      render(
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title1}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title2}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title3}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemTrigger1 = screen.getByRole("button", {
        name: title1,
      });

      // Act - Tab to second trigger, then press ArrowUp
      await user.tab();
      await user.tab();
      await user.keyboard("[ArrowUp]");

      // Assert
      expect(accordionItemTrigger1).toHaveFocus();
    });

    it("should wrap to last item when pressing ArrowUp from first item", async () => {
      // Arrange
      const user = userEvent.setup();
      const title1 = "Accordion Trigger 1";
      const title2 = "Accordion Trigger 2";
      const title3 = "Accordion Trigger 3";
      render(
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title1}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title2}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title3}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemTrigger1 = screen.getByRole("button", {
        name: title1,
      });
      const accordionItemTrigger3 = screen.getByRole("button", {
        name: title3,
      });

      // Act - Tab to first trigger, then press ArrowUp to wrap to last
      await user.tab();
      expect(accordionItemTrigger1).toHaveFocus();

      await user.keyboard("[ArrowUp]");

      // Assert - Should wrap around to the last item
      expect(accordionItemTrigger3).toHaveFocus();
    });

    it("should wrap to first item when pressing ArrowDown from last item", async () => {
      // Arrange
      const user = userEvent.setup();
      const title1 = "Accordion Trigger 1";
      const title2 = "Accordion Trigger 2";
      const title3 = "Accordion Trigger 3";
      render(
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title1}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title2}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title3}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemTrigger1 = screen.getByRole("button", {
        name: title1,
      });
      const accordionItemTrigger3 = screen.getByRole("button", {
        name: title3,
      });

      // Act - Tab to last trigger, then press ArrowDown to wrap to first
      await user.tab();
      await user.tab();
      await user.tab();
      expect(accordionItemTrigger3).toHaveFocus();

      await user.keyboard("[ArrowDown]");

      // Assert - Should wrap around to the last item
      expect(accordionItemTrigger1).toHaveFocus();
    });

    it('should move focus to the first accordion trigger when focus is on an accordion trigger and the "Home" key is pressed', async () => {
      // Arrange
      const user = userEvent.setup();
      const title1 = "Accordion Trigger 1";
      const title2 = "Accordion Trigger 2";
      const title3 = "Accordion Trigger 3";
      render(
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title1}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title2}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title3}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemTrigger1 = screen.getByRole("button", {
        name: title1,
      });

      // Act - Tab to third trigger, then press Home
      await user.tab();
      await user.tab();
      await user.tab();
      await user.keyboard("[Home]");

      // Assert
      expect(accordionItemTrigger1).toHaveFocus();
    });

    it('should move focus to the last accordion trigger when focus is on an accordion trigger and the "End" key is pressed', async () => {
      // Arrange
      const user = userEvent.setup();
      const title1 = "Accordion Trigger 1";
      const title2 = "Accordion Trigger 2";
      const title3 = "Accordion Trigger 3";
      render(
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title1}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title2}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>{title3}</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const accordionItemTrigger3 = screen.getByRole("button", {
        name: title3,
      });

      // Act - Tab to first trigger, then press End
      await user.tab();
      await user.keyboard("[End]");

      // Assert
      expect(accordionItemTrigger3).toHaveFocus();
    });
  });

  describe("multiple mode", () => {
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

  describe("default value", () => {
    it("should render first accordion item panel as expanded when using defaultValue with item useId", async () => {
      // Test that defaultValue works when items have explicit value props
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
});
