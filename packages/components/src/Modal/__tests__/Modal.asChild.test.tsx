import "./dialog-polyfill";

import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal } from "../Modal";

describe("Modal.Trigger — asChild", () => {
  it("renders the consumer-supplied element instead of a button", () => {
    // Arrange & Act
    render(
      <Modal.Root>
        <Modal.Trigger asChild>
          <a href="/foo" data-testid="link">
            Open
          </a>
        </Modal.Trigger>
      </Modal.Root>,
    );

    // Assert
    const link = screen.getByTestId("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("aria-haspopup", "dialog");
    expect(link).toHaveAttribute("aria-expanded", "false");
    expect(link).toHaveAttribute("aria-controls");
  });

  it("still opens the modal when the slotted element is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root onOpenChange={onOpenChange}>
        <Modal.Trigger asChild>
          <a href="/foo" data-testid="link">
            Open
          </a>
        </Modal.Trigger>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByTestId("link"));

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("composes the consumer's ref with the library's", () => {
    // Arrange
    const ref = createRef<HTMLAnchorElement>();

    // Act
    render(
      <Modal.Root>
        <Modal.Trigger asChild>
          <a ref={ref} href="/foo" data-testid="link">
            Open
          </a>
        </Modal.Trigger>
      </Modal.Root>,
    );

    // Assert
    expect(ref.current).toBe(screen.getByTestId("link"));
  });
});

describe("Modal.Close — asChild", () => {
  it("renders the consumer-supplied element and closes on click", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Content>
          <Modal.Close asChild>
            <a href="#" data-testid="close-link">
              Dismiss
            </a>
          </Modal.Close>
        </Modal.Content>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByTestId("close-link"));

    // Assert
    const link = screen.getByTestId("close-link");
    expect(link.tagName).toBe("A");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("Modal.Title — asChild", () => {
  it("renders the consumer-supplied heading and still registers aria-labelledby", () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Title asChild>
            <h3 data-testid="custom-title">Payment</h3>
          </Modal.Title>
        </Modal.Content>
      </Modal.Root>,
    );

    // Assert
    const heading = screen.getByTestId("custom-title");
    expect(heading.tagName).toBe("H3");
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog).toHaveAttribute("aria-labelledby", heading.id);
    expect(heading.id).toBeTruthy();
  });
});

describe("Modal.Description — asChild", () => {
  it("renders the consumer-supplied element and still registers aria-describedby", () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Description asChild>
            <div data-testid="custom-description">Enter card details</div>
          </Modal.Description>
        </Modal.Content>
      </Modal.Root>,
    );

    // Assert
    const description = screen.getByTestId("custom-description");
    expect(description.tagName).toBe("DIV");
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog).toHaveAttribute("aria-describedby", description.id);
    expect(description.id).toBeTruthy();
  });
});

describe("Modal.Overlay — asChild", () => {
  it("renders the consumer-supplied element and closes on click", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Portal>
          <Modal.Overlay asChild>
            <section data-testid="custom-overlay" />
          </Modal.Overlay>
          <Modal.Content>body</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Act
    const overlay = screen.getByTestId("custom-overlay");

    // Assert — ARIA + data-state are forwarded to the consumer element
    expect(overlay.tagName).toBe("SECTION");
    expect(overlay).toHaveAttribute("aria-hidden", "true");
    expect(overlay).toHaveAttribute("data-state", "open");

    // Act
    await user.click(overlay);

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
