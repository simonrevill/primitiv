import "./dialog-polyfill";

import { render, screen } from "@testing-library/react";

import { Modal } from "../Modal";

function getDialog() {
  return document.querySelector("dialog") as HTMLDialogElement;
}

describe("Modal accessibility — Title and Description", () => {
  it("renders Title as an <h2> with its children", () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Title>Payment</Modal.Title>
        </Modal.Content>
      </Modal.Root>,
    );

    // Assert
    const heading = screen.getByRole("heading", { level: 2, name: "Payment" });
    expect(heading.tagName).toBe("H2");
  });

  it("renders Description as a <p> with its children", () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Description>Enter your card details</Modal.Description>
        </Modal.Content>
      </Modal.Root>,
    );

    // Assert
    const paragraph = screen.getByText("Enter your card details");
    expect(paragraph.tagName).toBe("P");
  });

  it("wires aria-labelledby on the dialog to the Title's id", () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Title>Payment</Modal.Title>
        </Modal.Content>
      </Modal.Root>,
    );

    // Assert
    const heading = screen.getByRole("heading", { level: 2, name: "Payment" });
    const dialog = getDialog();
    expect(heading.id).toBeTruthy();
    expect(dialog).toHaveAttribute("aria-labelledby", heading.id);
  });

  it("wires aria-describedby on the dialog to the Description's id", () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Description>Enter your card details</Modal.Description>
        </Modal.Content>
      </Modal.Root>,
    );

    // Assert
    const paragraph = screen.getByText("Enter your card details");
    const dialog = getDialog();
    expect(paragraph.id).toBeTruthy();
    expect(dialog).toHaveAttribute("aria-describedby", paragraph.id);
  });

  it("has neither aria-labelledby nor aria-describedby when Title/Description are absent", () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Content data-testid="content">body</Modal.Content>
      </Modal.Root>,
    );

    // Assert
    const dialog = getDialog();
    expect(dialog).not.toHaveAttribute("aria-labelledby");
    expect(dialog).not.toHaveAttribute("aria-describedby");
  });

  it("drops aria-labelledby when the Title unmounts", () => {
    // Arrange
    const { rerender } = render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Title>Payment</Modal.Title>
        </Modal.Content>
      </Modal.Root>,
    );
    expect(getDialog()).toHaveAttribute("aria-labelledby");

    // Act
    rerender(
      <Modal.Root defaultOpen>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );

    // Assert
    expect(getDialog()).not.toHaveAttribute("aria-labelledby");
  });

  it("drops aria-describedby when the Description unmounts", () => {
    // Arrange
    const { rerender } = render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Description>Enter your card details</Modal.Description>
        </Modal.Content>
      </Modal.Root>,
    );
    expect(getDialog()).toHaveAttribute("aria-describedby");

    // Act
    rerender(
      <Modal.Root defaultOpen>
        <Modal.Content>body</Modal.Content>
      </Modal.Root>,
    );

    // Assert
    expect(getDialog()).not.toHaveAttribute("aria-describedby");
  });

  it("forwards extra HTML attributes (e.g. className) to the Description element", () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Description className="my-description" data-testid="desc-el">
            Enter your card details
          </Modal.Description>
        </Modal.Content>
      </Modal.Root>,
    );

    // Assert
    const paragraph = screen.getByTestId("desc-el");
    expect(paragraph).toHaveClass("my-description");
  });

  it("forwards extra HTML attributes (e.g. className) to the Title element", () => {
    // Arrange & Act
    render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Title className="my-title" data-testid="title-el">
            Payment
          </Modal.Title>
        </Modal.Content>
      </Modal.Root>,
    );

    // Assert
    const heading = screen.getByTestId("title-el");
    expect(heading).toHaveClass("my-title");
  });
});
