import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { createRef } from "react";

import { Slot } from "../Slot";

describe("Slot tests", () => {
  describe("error handling", () => {
    it("throws when given zero children", () => {
      // Arrange & Assert
      expect(() => {
        render(<Slot />);
      }).toThrow("Slot requires exactly one React element child.");
    });

    it("throws when given a non-element child (string)", () => {
      expect(() => {
        // Arrange & Assert
        render(<Slot>{"plain text"}</Slot>);
      }).toThrow("Slot requires exactly one React element child.");
    });
  });

  describe("mergeProps — event handlers", () => {
    it("uses the slot handler when only the slot provides one (key absent from child)", async () => {
      // Arrange
      const user = userEvent.setup();
      const slotClick = vi.fn();
      render(
        <Slot onClick={slotClick}>
          {/* child has no onClick key at all */}
          <button type="button">Click me</button>
        </Slot>,
      );

      // Act
      await user.click(screen.getByRole("button"));

      // Assert
      expect(slotClick).toHaveBeenCalledTimes(1);
    });

    it("uses the slot handler when child has the key but sets it to undefined", async () => {
      // Arrange
      const user = userEvent.setup();
      const slotClick = vi.fn();
      render(
        <Slot onClick={slotClick}>
          {/* child explicitly passes onClick={undefined} — key is present but falsy */}
          <button type="button" onClick={undefined}>
            Click me
          </button>
        </Slot>,
      );

      // Act
      await user.click(screen.getByRole("button"));

      // Assert
      expect(slotClick).toHaveBeenCalledTimes(1);
    });

    it("preserves the child handler unchanged when the slot has no handler for that key", async () => {
      // Arrange
      const user = userEvent.setup();
      const childClick = vi.fn();
      render(
        // Slot provides no onClick — child's handler should fire unaffected
        <Slot>
          <button type="button" onClick={childClick}>
            Click me
          </button>
        </Slot>,
      );

      // Act
      await user.click(screen.getByRole("button"));

      // Assert
      expect(childClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("mergeProps — style", () => {
    it("shallow-merges style objects, child wins on collisions", () => {
      // Arrange
      const { container } = render(
        <Slot style={{ color: "red", fontWeight: "bold" }}>
          <span style={{ color: "blue" }}>text</span>
        </Slot>,
      );
      const el = container.firstChild as HTMLElement;

      // Assert
      expect(el.style.color).toBe("blue"); // child wins on collision
      expect(el.style.fontWeight).toBe("bold"); // slot contributes non-colliding prop
    });
  });

  describe("getRef", () => {
    it("reads ref from props.ref when present (React 19: child element carries its own ref)", () => {
      // Arrange
      // In React 19, a ref passed directly to a child element lands in props.ref.
      // getRef must return it so composeRefs can wire it together with the Slot's
      // own forwardedRef — otherwise the child's ref is silently dropped.
      const childRef = createRef<HTMLDivElement>();
      const slotRef = createRef<HTMLElement>();
      const SlotWithRef = React.forwardRef<HTMLElement>((_props, ref) => (
        // child element carries its own ref — this exercises the props.ref branch
        <Slot ref={ref}>
          <div ref={childRef}>text</div>
        </Slot>
      ));
      render(<SlotWithRef ref={slotRef} />);

      // Assert
      // Both refs populated: childRef via props.ref (React 19 path in getRef),
      // slotRef via the Slot's forwardedRef composed together.
      expect(slotRef.current).not.toBeNull();
      expect(childRef.current).not.toBeNull();
      expect(childRef.current?.tagName).toBe("DIV");
    });

    it("falls back to element.ref when props.ref is absent (React ≤18 element structure)", () => {
      // Arrange
      // In React ≤18, ref is on element.ref and absent from element.props.
      // getRef must fall back to element.ref so composeRefs can wire both refs.
      const childRef = createRef<HTMLDivElement>();
      const slotRef = createRef<HTMLElement>();
      // Use a real element as the base so $$typeof matches the runtime, then
      // overlay the React ≤18 shape: ref on the element object, absent from props.
      const baseElement = React.createElement("div", null, "text");
      const react18Element = {
        ...baseElement,
        ref: childRef, // React ≤18: ref lives here …
        props: { children: "text" }, // … not in props
      } as unknown as React.ReactElement;
      const SlotWithRef = React.forwardRef<HTMLElement>((_props, ref) => (
        <Slot ref={ref}>{react18Element}</Slot>
      ));
      render(<SlotWithRef ref={slotRef} />);

      // Assert
      expect(slotRef.current).not.toBeNull();
      expect(childRef.current).not.toBeNull();
      expect(childRef.current?.tagName).toBe("DIV");
    });
  });

  describe("mergeProps — className", () => {
    it("concatenates slot and child classNames", () => {
      // Arrange
      render(
        <Slot className="slot-class">
          <span className="child-class">text</span>
        </Slot>,
      );

      // Assert
      expect(screen.getByText("text")).toHaveClass("slot-class", "child-class");
    });
  });
});
