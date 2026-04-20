import "./dialog-polyfill";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal } from "../Modal";

describe("Modal.Overlay", () => {
  it("renders only when the modal is open", () => {
    // Arrange & Act
    render(
      <Modal.Root>
        <Modal.Portal>
          <Modal.Overlay data-testid="overlay" />
          <Modal.Content>body</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Assert
    expect(screen.queryByTestId("overlay")).toBeNull();
  });

  it('renders with data-state="open" when the modal is open', () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Portal>
          <Modal.Overlay data-testid="overlay" />
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

  it('declares aria-hidden="true" so the decorative backdrop is skipped by screen readers', () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Portal>
          <Modal.Overlay data-testid="overlay" />
          <Modal.Content>body</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Assert
    expect(screen.getByTestId("overlay")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("does not close the modal when clicked — the native <dialog>'s ::backdrop paints over this div, so click-outside is wired on the dialog itself", async () => {
    // Arrange
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root open={true} onOpenChange={onOpenChange}>
        <Modal.Portal>
          <Modal.Overlay data-testid="overlay" />
          <Modal.Content>body</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByTestId("overlay"));

    // Assert — overlay click is a no-op for closing; see Modal.click-outside.test.tsx
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("still forwards consumer onClick handlers", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Modal.Root defaultOpen>
        <Modal.Portal>
          <Modal.Overlay data-testid="overlay" onClick={onClick} />
          <Modal.Content>body</Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    // Act
    await user.click(screen.getByTestId("overlay"));

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
