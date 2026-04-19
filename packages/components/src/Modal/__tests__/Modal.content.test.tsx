import "./dialog-polyfill";

import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";

import { Modal } from "../Modal";

function getDialog() {
  return document.querySelector("dialog") as HTMLDialogElement;
}

describe("Modal.Content — native <dialog> behaviour", () => {
  it("calls showModal() when open flips to true", async () => {
    // Arrange
    const user = userEvent.setup();
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    render(
      <Modal.Root>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Open" }));

    // Assert
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(getDialog().open).toBe(true);

    showModal.mockRestore();
  });

  it("calls close() when open flips to false", async () => {
    // Arrange
    const user = userEvent.setup();
    const close = vi.spyOn(HTMLDialogElement.prototype, "close");
    render(
      <Modal.Root defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Close>Close</Modal.Close>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );
    expect(getDialog().open).toBe(true);

    // Act
    await user.click(screen.getByRole("button", { name: "Close" }));

    // Assert
    expect(close).toHaveBeenCalled();
    expect(getDialog().open).toBe(false);

    close.mockRestore();
  });

  it("calls showModal() on initial mount when defaultOpen is true", () => {
    // Arrange
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");

    // Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );

    // Assert
    expect(showModal).toHaveBeenCalledTimes(1);

    showModal.mockRestore();
  });

  it("does not call showModal() when already open (idempotent)", () => {
    // Arrange
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    const { rerender } = render(
      <Modal.Root open={true} onOpenChange={() => undefined}>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );
    expect(showModal).toHaveBeenCalledTimes(1);

    // Act: re-render with same open=true
    rerender(
      <Modal.Root open={true} onOpenChange={() => undefined}>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );

    // Assert
    expect(showModal).toHaveBeenCalledTimes(1);

    showModal.mockRestore();
  });

  it("does not call close() when already closed (idempotent)", () => {
    // Arrange
    const close = vi.spyOn(HTMLDialogElement.prototype, "close");

    // Act: mount with open=false (never opened)
    render(
      <Modal.Root open={false} onOpenChange={() => undefined}>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );

    // Assert
    expect(close).not.toHaveBeenCalled();

    close.mockRestore();
  });

  it("sets data-state='open' when open and 'closed' when closed", async () => {
    // Arrange
    function Wrapper() {
      const [open, setOpen] = useState(false);
      return (
        <Modal.Root open={open} onOpenChange={setOpen}>
          <Modal.Trigger>Open</Modal.Trigger>
          <Modal.Content>body</Modal.Content>
        </Modal.Root>
      );
    }
    const user = userEvent.setup();
    render(<Wrapper />);
    const dialog = getDialog();

    // Assert initial
    expect(dialog).toHaveAttribute("data-state", "closed");

    // Act
    await user.click(screen.getByRole("button", { name: "Open" }));

    // Assert open
    expect(dialog).toHaveAttribute("data-state", "open");
  });

  it("closes via onOpenChange when the native close event fires", () => {
    // Arrange
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );
    const dialog = getDialog();

    // Act — simulate the browser firing close (e.g. form method=dialog submit)
    act(() => {
      dialog.dispatchEvent(new Event("close"));
    });

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes via onOpenChange when the native cancel event fires (Esc)", () => {
    // Arrange
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );
    const dialog = getDialog();

    // Act
    act(() => {
      fireEvent(dialog, new Event("cancel", { cancelable: true }));
    });

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("forwards a consumer-supplied ref to the underlying <dialog>", () => {
    // Arrange
    const ref = createRef<HTMLDialogElement>();

    // Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Content ref={ref}>body</Modal.Content>
      </Modal.Root>,
    );

    // Assert
    expect(ref.current).toBe(getDialog());
    expect(ref.current?.tagName).toBe("DIALOG");
  });
});
