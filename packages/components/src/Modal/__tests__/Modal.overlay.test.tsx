import "./dialog-polyfill";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal } from "../Modal";

describe("Modal.Overlay", () => {
  it("renders only when the modal is open", () => {
    // Arrange & Act
    render(
      <Modal.Root>
        <Modal.Portal>
          <Modal.Overlay data-testid="overlay" />
          <Modal.Content>body</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Assert
    expect(screen.queryByTestId("overlay")).toBeNull();
  });

  it('renders with data-state="open" when the modal is open', () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Portal>
          <Modal.Overlay data-testid="overlay" />
          <Modal.Content>body</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Assert
    expect(screen.getByTestId("overlay")).toHaveAttribute(
      "data-state",
      "open",
    );
  });

  it('declares aria-hidden="true" so the decorative backdrop is skipped by screen readers', () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Portal>
          <Modal.Overlay data-testid="overlay" />
          <Modal.Content>body</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Assert
    expect(screen.getByTestId("overlay")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("closes the modal when clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Portal>
          <Modal.Overlay data-testid="overlay" />
          <Modal.Content>body</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByTestId("overlay"));

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("runs the consumer's onClick before the library's close handler", async () => {
    // Arrange
    const user = userEvent.setup();
    const order: string[] = [];
    const onOpenChange = vi.fn(() => order.push("close"));
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Portal>
          <Modal.Overlay
            data-testid="overlay"
            onClick={() => order.push("consumer")}
          />
          <Modal.Content>body</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByTestId("overlay"));

    // Assert
    expect(order).toEqual(["consumer", "close"]);
  });

  it("lets the consumer veto close via preventDefault on onClick", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Portal>
          <Modal.Overlay
            data-testid="overlay"
            onClick={(event) => event.preventDefault()}
          />
          <Modal.Content>body</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByTestId("overlay"));

    // Assert
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
