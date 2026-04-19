import "./dialog-polyfill";

import { render, screen } from "@testing-library/react";

import { Modal } from "../Modal";

describe("Modal forceMount", () => {
  describe("Modal.Portal", () => {
    it("renders children while closed when forceMount is set", () => {
      // Arrange & Act
      render(
        <Modal.Root>
          <Modal.Portal forceMount>
            <div data-testid="portaled">hello</div>
          </Modal.Portal>
        </Modal.Root>,
      );

      // Assert
      expect(screen.getByTestId("portaled")).toBeInTheDocument();
    });

    it("still renders into a custom container when forceMount is set", () => {
      // Arrange
      const container = document.createElement("div");
      document.body.appendChild(container);

      // Act
      render(
        <Modal.Root>
          <Modal.Portal forceMount container={container}>
            <div data-testid="portaled">hello</div>
          </Modal.Portal>
        </Modal.Root>,
      );

      // Assert
      expect(container).toContainElement(screen.getByTestId("portaled"));

      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe("Modal.Overlay", () => {
    it("does not render while closed when only the Portal forceMounts", () => {
      // Arrange & Act — Portal stays mounted but Overlay opts out of forceMount
      render(
        <Modal.Root>
          <Modal.Portal forceMount>
            <Modal.Overlay data-testid="overlay" />
            <Modal.Content>body</Modal.Content>
          </Modal.Portal>
        </Modal.Root>,
      );

      // Assert — Overlay short-circuits independently
      expect(screen.queryByTestId("overlay")).toBeNull();
    });

    it('renders with data-state="closed" while closed when forceMount is set', () => {
      // Arrange & Act
      render(
        <Modal.Root>
          <Modal.Portal forceMount>
            <Modal.Overlay data-testid="overlay" forceMount />
            <Modal.Content>body</Modal.Content>
          </Modal.Portal>
        </Modal.Root>,
      );

      // Assert
      expect(screen.getByTestId("overlay")).toHaveAttribute(
        "data-state",
        "closed",
      );
    });

    it("flips data-state to open when the modal opens", () => {
      // Arrange
      const { rerender } = render(
        <Modal.Root>
          <Modal.Portal forceMount>
            <Modal.Overlay data-testid="overlay" forceMount />
            <Modal.Content>body</Modal.Content>
          </Modal.Portal>
        </Modal.Root>,
      );
      expect(screen.getByTestId("overlay")).toHaveAttribute(
        "data-state",
        "closed",
      );

      // Act
      rerender(
        <Modal.Root open onOpenChange={() => undefined}>
          <Modal.Portal forceMount>
            <Modal.Overlay data-testid="overlay" forceMount />
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
  });
});
