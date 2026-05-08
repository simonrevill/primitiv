import { render } from "@testing-library/react";

import { Modal } from "../Modal";

describe("Modal — error handling", () => {
  describe("context consumer null guard", () => {
    it.each([
      ["Modal.Trigger", <Modal.Trigger key="t">Open</Modal.Trigger>],
      ["Modal.Portal", <Modal.Portal key="p">portal</Modal.Portal>],
      ["Modal.Overlay", <Modal.Overlay key="o" />],
      ["Modal.Content", <Modal.Content key="c">content</Modal.Content>],
      ["Modal.Title", <Modal.Title key="ti">title</Modal.Title>],
      ["Modal.Description", <Modal.Description key="d">desc</Modal.Description>],
      ["Modal.Close", <Modal.Close key="cl">close</Modal.Close>],
    ])(
      "%s throws when rendered outside Modal.Root",
      (_name, element) => {
        // Arrange
        const err = vi.spyOn(console, "error").mockImplementation(() => undefined);

        // Act & Assert
        expect(() => render(element)).toThrow(
          "Component must be rendered as a child of Modal.Root",
        );

        err.mockRestore();
      },
    );
  });
});
