import "./dialog-polyfill";

import { act, fireEvent, render } from "@testing-library/react";

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

// onPointerDownOutside is driven by the dialog's own pointerdown event
// and is covered in Modal.click-outside.test.tsx — it used to be wired
// through the sibling Overlay's onClick, but the native <dialog>'s
// ::backdrop paints over the overlay so that path was unreachable in
// real browsers.
