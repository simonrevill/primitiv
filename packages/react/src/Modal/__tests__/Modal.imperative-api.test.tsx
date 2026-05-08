import "./dialog-polyfill";

import { createRef } from "react";
import { act, render, screen } from "@testing-library/react";

import { Modal } from "../Modal";
import { ModalImperativeApi } from "../types";

describe("Modal imperative API", () => {
  it("opens the modal via ref.current.open()", () => {
    // Arrange
    const ref = createRef<ModalImperativeApi>();
    render(
      <Modal.Root ref={ref}>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog.hasAttribute("open")).toBe(false);

    // Act
    act(() => {
      ref.current?.open();
    });

    // Assert
    expect(dialog.hasAttribute("open")).toBe(true);
  });

  it("closes the modal via ref.current.close()", () => {
    // Arrange
    const ref = createRef<ModalImperativeApi>();
    render(
      <Modal.Root ref={ref} defaultOpen>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog.hasAttribute("open")).toBe(true);

    // Act
    act(() => {
      ref.current?.close();
    });

    // Assert
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("notifies onOpenChange when opened or closed imperatively", () => {
    // Arrange
    const ref = createRef<ModalImperativeApi>();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root ref={ref} onOpenChange={onOpenChange}>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );

    // Act
    act(() => {
      ref.current?.open();
    });

    // Assert
    expect(onOpenChange).toHaveBeenNthCalledWith(1, true);

    // Act
    act(() => {
      ref.current?.close();
    });

    // Assert
    expect(onOpenChange).toHaveBeenNthCalledWith(2, false);
  });

  it("works in controlled mode by delegating to the consumer's onOpenChange", () => {
    // Arrange
    const ref = createRef<ModalImperativeApi>();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root ref={ref} open={false} onOpenChange={onOpenChange}>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );

    // Act
    act(() => {
      ref.current?.open();
    });

    // Assert — controlled mode: the library asks the parent to open
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // And does NOT flip internal state; parent must re-render
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("Modal.Trigger still works alongside the imperative API", async () => {
    // Arrange
    const ref = createRef<ModalImperativeApi>();
    const { rerender: _ } = render(
      <Modal.Root ref={ref}>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Act
    act(() => {
      ref.current?.open();
    });

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
