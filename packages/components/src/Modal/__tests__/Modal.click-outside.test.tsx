import "./dialog-polyfill";

import { act, fireEvent, render } from "@testing-library/react";

import { Modal } from "../Modal";

function getDialog() {
  return document.querySelector("dialog") as HTMLDialogElement;
}

function stubRect(
  dialog: HTMLDialogElement,
  rect: { left: number; top: number; right: number; bottom: number },
) {
  const domRect = {
    ...rect,
    x: rect.left,
    y: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
    toJSON() {
      return this;
    },
  } as DOMRect;
  dialog.getBoundingClientRect = () => domRect;
}

describe("Modal.Content — click-outside via dialog bounding rect", () => {
  it("closes the modal when pointerdown lands outside the dialog's rect (the native ::backdrop area)", () => {
    // Arrange — dialog occupies the middle 200x200 of the viewport
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );
    const dialog = getDialog();
    stubRect(dialog, { left: 100, top: 100, right: 300, bottom: 300 });

    // Act — pointerdown at (50, 50), outside the rect
    act(() => {
      fireEvent.pointerDown(dialog, { clientX: 50, clientY: 50 });
    });

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close the modal when pointerdown lands inside the dialog's rect (content or padding)", () => {
    // Arrange
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );
    const dialog = getDialog();
    stubRect(dialog, { left: 100, top: 100, right: 300, bottom: 300 });

    // Act — pointerdown at (200, 200), inside the rect
    act(() => {
      fireEvent.pointerDown(dialog, { clientX: 200, clientY: 200 });
    });

    // Assert
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("fires onPointerDownOutside with the native event when the backdrop is pressed", () => {
    // Arrange
    const onPointerDownOutside = vi.fn();
    render(
      <Modal.Root defaultOpen>
        <Modal.Content onPointerDownOutside={onPointerDownOutside}>
          body
        </Modal.Content>
      </Modal.Root>,
    );
    const dialog = getDialog();
    stubRect(dialog, { left: 100, top: 100, right: 300, bottom: 300 });

    // Act
    act(() => {
      fireEvent.pointerDown(dialog, { clientX: 50, clientY: 50 });
    });

    // Assert
    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
    expect(onPointerDownOutside.mock.calls[0][0]).toBeInstanceOf(Event);
  });

  it("does not close when the consumer's onPointerDownOutside calls event.preventDefault()", () => {
    // Arrange
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Content
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          body
        </Modal.Content>
      </Modal.Root>,
    );
    const dialog = getDialog();
    stubRect(dialog, { left: 100, top: 100, right: 300, bottom: 300 });

    // Act
    act(() => {
      fireEvent.pointerDown(dialog, { clientX: 50, clientY: 50 });
    });

    // Assert
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
