import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Modal } from "../Modal";

describe("Modal — controlled state", () => {
  it("reflects the consumer's open prop on the trigger", () => {
    // Arrange & Act
    render(
      <Modal.Root open={true} onOpenChange={() => undefined}>
        <Modal.Trigger>Open</Modal.Trigger>
      </Modal.Root>,
    );

    // Assert
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("calls onOpenChange(true) when the trigger is clicked in controlled mode", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={false} onOpenChange={onOpenChange}>
        <Modal.Trigger>Open</Modal.Trigger>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Open" }));

    // Assert
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange(false) when Modal.Close is clicked in controlled mode", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Close>Close</Modal.Close>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Close" }));

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not flip state internally when controlled — consumer must drive open", async () => {
    // Arrange: consumer renders with open=false and deliberately ignores changes
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={false} onOpenChange={onOpenChange}>
        <Modal.Trigger>Open</Modal.Trigger>
      </Modal.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });

    // Act
    await user.click(trigger);

    // Assert: aria-expanded stays false because consumer never flipped open
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("updates when the consumer lifts state and drives open via onOpenChange", async () => {
    // Arrange
    function Wrapper() {
      const [open, setOpen] = useState(false);
      return (
        <Modal.Root open={open} onOpenChange={setOpen}>
          <Modal.Trigger>Open</Modal.Trigger>
          <Modal.Close>Close</Modal.Close>
        </Modal.Root>
      );
    }
    const user = userEvent.setup();
    render(<Wrapper />);
    const trigger = screen.getByRole("button", { name: "Open" });

    // Act
    await user.click(trigger);

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Act
    await user.click(screen.getByRole("button", { name: "Close" }));

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onOpenChange from uncontrolled mode too (defaultOpen)", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root defaultOpen={false} onOpenChange={onOpenChange}>
        <Modal.Trigger>Open</Modal.Trigger>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Open" }));

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
