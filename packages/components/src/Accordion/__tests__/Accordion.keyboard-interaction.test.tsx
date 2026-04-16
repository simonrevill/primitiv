import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Accordion } from "../Accordion";

describe("Accordion keyboard interaction tests", () => {
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

  it('should move focus from the second to the third trigger when "ArrowDown" is pressed', async () => {
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

    // Act - Tab to second trigger, then press ArrowDown
    await user.tab();
    await user.tab();
    await user.keyboard("[ArrowDown]");

    // Assert
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

    // Assert - Should wrap around to the first item
    expect(accordionItemTrigger1).toHaveFocus();
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

  it('should move focus from the third to the second trigger when "ArrowUp" is pressed', async () => {
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

    // Act - Tab to third trigger, then press ArrowUp
    await user.tab();
    await user.tab();
    await user.tab();
    await user.keyboard("[ArrowUp]");

    // Assert
    expect(accordionItemTrigger2).toHaveFocus();
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

  it('should move focus to the next trigger using "ArrowRight" when orientation="horizontal"', async () => {
    // Arrange
    const user = userEvent.setup();
    const title1 = "Accordion Trigger 1";
    const title2 = "Accordion Trigger 2";
    const title3 = "Accordion Trigger 3";
    render(
      <Accordion.Root orientation="horizontal">
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
    await user.keyboard("[ArrowRight]");

    // Assert
    expect(accordionItemTrigger2).toHaveFocus();
  });

  it('should move focus to the previous trigger using "ArrowLeft" when orientation="horizontal"', async () => {
    // Arrange
    const user = userEvent.setup();
    const title1 = "Accordion Trigger 1";
    const title2 = "Accordion Trigger 2";
    const title3 = "Accordion Trigger 3";
    render(
      <Accordion.Root orientation="horizontal">
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

    // Act - Tab to second trigger, then press ArrowLeft
    await user.tab();
    await user.tab();
    await user.keyboard("[ArrowLeft]");

    // Assert
    expect(accordionItemTrigger1).toHaveFocus();
  });

  it('should wrap to the first trigger using "ArrowRight" from the last trigger when orientation="horizontal"', async () => {
    // Arrange
    const user = userEvent.setup();
    const title1 = "Accordion Trigger 1";
    const title2 = "Accordion Trigger 2";
    const title3 = "Accordion Trigger 3";
    render(
      <Accordion.Root orientation="horizontal">
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

    // Act - Tab to last trigger, then press ArrowRight to wrap
    await user.tab();
    await user.tab();
    await user.tab();
    await user.keyboard("[ArrowRight]");

    // Assert
    expect(accordionItemTrigger1).toHaveFocus();
  });

  it('should wrap to the last trigger using "ArrowLeft" from the first trigger when orientation="horizontal"', async () => {
    // Arrange
    const user = userEvent.setup();
    const title1 = "Accordion Trigger 1";
    const title2 = "Accordion Trigger 2";
    const title3 = "Accordion Trigger 3";
    render(
      <Accordion.Root orientation="horizontal">
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

    // Act - Tab to first trigger, then press ArrowLeft to wrap
    await user.tab();
    await user.keyboard("[ArrowLeft]");

    // Assert
    expect(accordionItemTrigger3).toHaveFocus();
  });

  it('should NOT move focus when pressing "ArrowDown" while orientation="horizontal"', async () => {
    // Arrange
    const user = userEvent.setup();
    const title1 = "Accordion Trigger 1";
    const title2 = "Accordion Trigger 2";
    render(
      <Accordion.Root orientation="horizontal">
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
      </Accordion.Root>,
    );
    const accordionItemTrigger1 = screen.getByRole("button", {
      name: title1,
    });

    // Act
    await user.tab();
    await user.keyboard("[ArrowDown]");

    // Assert - focus should remain on trigger 1
    expect(accordionItemTrigger1).toHaveFocus();
  });

  it('should NOT move focus when pressing "ArrowUp" while orientation="horizontal"', async () => {
    // Arrange
    const user = userEvent.setup();
    const title1 = "Accordion Trigger 1";
    const title2 = "Accordion Trigger 2";
    render(
      <Accordion.Root orientation="horizontal">
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
      </Accordion.Root>,
    );
    const accordionItemTrigger2 = screen.getByRole("button", {
      name: title2,
    });

    // Act - Tab to second trigger, then press ArrowUp (should be ignored in horizontal)
    await user.tab();
    await user.tab();
    await user.keyboard("[ArrowUp]");

    // Assert - focus should remain on trigger 2
    expect(accordionItemTrigger2).toHaveFocus();
  });
});
