import "./dialog-polyfill";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal } from "../Modal";

describe("Modal.Portal", () => {
  it("renders its children into document.body by default when open", () => {
    // Arrange & Act
    render(
      <section data-testid="tree-root">
        <Modal.Root defaultOpen>
          <Modal.Portal>
            <div data-testid="portaled">hello</div>
          </Modal.Portal>
        </Modal.Root>
      </section>,
    );

    // Assert
    const portaled = screen.getByTestId("portaled");
    expect(document.body).toContainElement(portaled);
    // Not nested under the Root's React parent
    expect(screen.getByTestId("tree-root")).not.toContainElement(portaled);
  });

  it("renders children into a consumer-supplied container element", () => {
    // Arrange
    const container = document.createElement("div");
    container.id = "custom-modal-root";
    document.body.appendChild(container);

    // Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Portal container={container}>
          <div data-testid="portaled">hello</div>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Assert
    expect(container).toContainElement(screen.getByTestId("portaled"));

    // Cleanup
    document.body.removeChild(container);
  });

  it("does not render children when the modal is closed", () => {
    // Arrange & Act
    render(
      <Modal.Root>
        <Modal.Portal>
          <div data-testid="portaled">hello</div>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Assert
    expect(screen.queryByTestId("portaled")).toBeNull();
  });

  it("mounts children when the modal opens and unmounts them when it closes", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Modal.Root>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Close>Close</Modal.Close>
        <Modal.Portal>
          <div data-testid="portaled">hello</div>
        </Modal.Portal>
      </Modal.Root>,
    );
    expect(screen.queryByTestId("portaled")).toBeNull();

    // Act
    await user.click(screen.getByRole("button", { name: "Open" }));

    // Assert
    expect(screen.getByTestId("portaled")).toBeInTheDocument();

    // Act
    await user.click(screen.getByRole("button", { name: "Close" }));

    // Assert
    expect(screen.queryByTestId("portaled")).toBeNull();
  });
});
