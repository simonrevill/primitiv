import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal } from "../Modal";

describe("Modal — uncontrolled state", () => {
  it("starts closed by default and reflects aria-expanded=false on the trigger", () => {
    // Arrange & Act
    render(
      <Modal.Root>
        <Modal.Trigger>Open</Modal.Trigger>
      </Modal.Root>,
    );

    // Assert
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("starts open when defaultOpen is true", () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
      </Modal.Root>,
    );

    // Assert
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("opens when the trigger is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Modal.Root>
        <Modal.Trigger>Open</Modal.Trigger>
      </Modal.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });

    // Act
    await user.click(trigger);

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes when Modal.Close is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Modal.Root defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Close>Close</Modal.Close>
      </Modal.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    const close = screen.getByRole("button", { name: "Close" });

    // Act
    await user.click(close);

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
