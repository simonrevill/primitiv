import { createRef } from "react";
import { render, screen } from "@testing-library/react";

import { RadioGroup } from "../RadioGroup";

describe("RadioGroup.Item ref forwarding", () => {
  it("forwards the underlying button element to a consumer function ref", () => {
    // Arrange
    const received: (HTMLButtonElement | null)[] = [];
    const functionRef = (node: HTMLButtonElement | null) => {
      received.push(node);
    };

    // Act
    render(
      <RadioGroup.Root aria-label="Colour">
        <RadioGroup.Item value="red" ref={functionRef}>
          Red
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    // Assert
    const button = screen.getByRole("radio", { name: "Red" });
    expect(received).toContain(button);
  });

  it("forwards the underlying button element to a consumer object ref", () => {
    // Arrange
    const objectRef = createRef<HTMLButtonElement>();

    // Act
    render(
      <RadioGroup.Root aria-label="Colour">
        <RadioGroup.Item value="red" ref={objectRef}>
          Red
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    // Assert
    const button = screen.getByRole("radio", { name: "Red" });
    expect(objectRef.current).toBe(button);
  });
});
