import { render, screen } from "@testing-library/react";

import { Modal } from "../Modal";

describe("Modal.Trigger", () => {
  it('declares aria-haspopup="dialog"', () => {
    // Arrange & Act
    render(
      <Modal.Root>
        <Modal.Trigger>Open</Modal.Trigger>
      </Modal.Root>,
    );

    // Assert
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
      "aria-haspopup",
      "dialog",
    );
  });

  it("references the content via aria-controls using the same id the content will render with", () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Portal>
          <Modal.Content>hi</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });

    // Assert
    const controlsId = trigger.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    expect(document.getElementById(controlsId!)).not.toBeNull();
  });

  it("defaults to type=button so the trigger never submits an enclosing form", () => {
    // Arrange & Act
    render(
      <Modal.Root>
        <Modal.Trigger>Open</Modal.Trigger>
      </Modal.Root>,
    );

    // Assert
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("respects a consumer-supplied type override", () => {
    // Arrange & Act
    render(
      <Modal.Root>
        <Modal.Trigger type="submit">Open</Modal.Trigger>
      </Modal.Root>,
    );

    // Assert
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
      "type",
      "submit",
    );
  });
});
