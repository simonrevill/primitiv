import "./dialog-polyfill";

import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Modal } from "../Modal";

describe("Modal — nested dialogs", () => {
  function NestedModals() {
    const [outerOpen, setOuterOpen] = useState(true);
    const [innerOpen, setInnerOpen] = useState(true);
    return (
      <Modal.Root open={outerOpen} onOpenChange={setOuterOpen}>
        <Modal.Portal>
          <Modal.Overlay data-testid="outer-overlay" />
          <Modal.Content data-testid="outer-content">
            <Modal.Close>Close outer</Modal.Close>
            <Modal.Root open={innerOpen} onOpenChange={setInnerOpen}>
              <Modal.Portal>
                <Modal.Overlay data-testid="inner-overlay" />
                <Modal.Content data-testid="inner-content">
                  <Modal.Close>Close inner</Modal.Close>
                </Modal.Content>
              </Modal.Portal>
            </Modal.Root>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>
    );
  }

  it("closes only the inner modal when the inner Close button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<NestedModals />);
    expect(screen.getByTestId("outer-content")).toHaveAttribute(
      "data-state",
      "open",
    );
    expect(screen.getByTestId("inner-content")).toHaveAttribute(
      "data-state",
      "open",
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Close inner" }));

    // Assert — inner closed, outer still open
    expect(screen.queryByTestId("inner-content")).toBeNull();
    expect(screen.getByTestId("outer-content")).toHaveAttribute(
      "data-state",
      "open",
    );
  });

  it("closes only the inner modal when the inner Overlay is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<NestedModals />);

    // Act
    await user.click(screen.getByTestId("inner-overlay"));

    // Assert
    expect(screen.queryByTestId("inner-content")).toBeNull();
    expect(screen.getByTestId("outer-content")).toHaveAttribute(
      "data-state",
      "open",
    );
  });

  it("closes only the inner modal when the native cancel event fires on the inner dialog", () => {
    // Arrange
    render(<NestedModals />);
    const innerDialog = screen.getByTestId("inner-content");

    // Act — native cancel (Esc) on the inner dialog
    act(() => {
      fireEvent(innerDialog, new Event("cancel", { cancelable: true }));
    });

    // Assert — inner dialog has unmounted, outer remains open
    expect(screen.queryByTestId("inner-content")).toBeNull();
    expect(screen.getByTestId("outer-content")).toHaveAttribute(
      "data-state",
      "open",
    );
  });
});
