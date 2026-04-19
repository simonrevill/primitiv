import "./dialog-polyfill";

import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal } from "../Modal";

function getDialog() {
  return document.querySelector("dialog") as HTMLDialogElement;
}

describe("Modal.Content — onEscapeKeyDown", () => {
  it("fires onEscapeKeyDown when the native cancel event is dispatched (Esc)", () => {
    // Arrange
    const onEscapeKeyDown = vi.fn();
    render(
      <Modal.Root defaultOpen>
        <Modal.Content onEscapeKeyDown={onEscapeKeyDown}>body</Modal.Content>
      </Modal.Root>,
    );

    // Act
    act(() => {
      fireEvent(getDialog(), new Event("cancel", { cancelable: true }));
    });

    // Assert
    expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
  });

  it("still closes the modal when the consumer does not veto", () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onEscapeKeyDown = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Content onEscapeKeyDown={onEscapeKeyDown}>body</Modal.Content>
      </Modal.Root>,
    );

    // Act
    act(() => {
      fireEvent(getDialog(), new Event("cancel", { cancelable: true }));
    });

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close when the consumer calls event.preventDefault()", () => {
    // Arrange
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Content onEscapeKeyDown={(event) => event.preventDefault()}>
          body
        </Modal.Content>
      </Modal.Root>,
    );

    // Act
    act(() => {
      fireEvent(getDialog(), new Event("cancel", { cancelable: true }));
    });

    // Assert
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("sees the latest onEscapeKeyDown across re-renders", () => {
    // Arrange
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(
      <Modal.Root defaultOpen>
        <Modal.Content onEscapeKeyDown={first}>body</Modal.Content>
      </Modal.Root>,
    );
    rerender(
      <Modal.Root defaultOpen>
        <Modal.Content onEscapeKeyDown={second}>body</Modal.Content>
      </Modal.Root>,
    );

    // Act
    act(() => {
      fireEvent(getDialog(), new Event("cancel", { cancelable: true }));
    });

    // Assert
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});

describe("Modal.Content — onPointerDownOutside", () => {
  it("fires onPointerDownOutside when the overlay is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onPointerDownOutside = vi.fn();
    render(
      <Modal.Root defaultOpen>
        <Modal.Portal>
          <Modal.Overlay data-testid="overlay" />
          <Modal.Content onPointerDownOutside={onPointerDownOutside}>
            body
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByTestId("overlay"));

    // Assert
    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
  });

  it("still closes the modal when the consumer does not veto", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Portal>
          <Modal.Overlay data-testid="overlay" />
          <Modal.Content onPointerDownOutside={() => undefined}>body</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByTestId("overlay"));

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close when the consumer calls event.preventDefault()", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Portal>
          <Modal.Overlay data-testid="overlay" />
          <Modal.Content
            onPointerDownOutside={(event) => event.preventDefault()}
          >
            body
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByTestId("overlay"));

    // Assert
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
