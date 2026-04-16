import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { Slot } from "../Slot";

describe("Slot", () => {
  describe("error handling", () => {
    it("throws when given zero children", () => {
      expect(() => {
        render(<Slot />);
      }).toThrow("Slot requires exactly one React element child.");
    });

    it("throws when given a non-element child (string)", () => {
      expect(() => {
        render(<Slot>{"plain text"}</Slot>);
      }).toThrow("Slot requires exactly one React element child.");
    });
  });

  describe("mergeProps — event handlers", () => {
    it("uses the slot handler when only the slot provides one (key absent from child)", async () => {
      const user = userEvent.setup();
      const slotClick = vi.fn();

      render(
        <Slot onClick={slotClick}>
          {/* child has no onClick key at all */}
          <button type="button">Click me</button>
        </Slot>,
      );

      await user.click(screen.getByRole("button"));

      expect(slotClick).toHaveBeenCalledTimes(1);
    });

    it("uses the slot handler when child has the key but sets it to undefined", async () => {
      const user = userEvent.setup();
      const slotClick = vi.fn();

      render(
        <Slot onClick={slotClick}>
          {/* child explicitly passes onClick={undefined} — key is present but falsy */}
          <button type="button" onClick={undefined}>Click me</button>
        </Slot>,
      );

      await user.click(screen.getByRole("button"));

      expect(slotClick).toHaveBeenCalledTimes(1);
    });

    it("preserves the child handler unchanged when the slot has no handler for that key", async () => {
      const user = userEvent.setup();
      const childClick = vi.fn();

      render(
        // Slot provides no onClick — child's handler should fire unaffected
        <Slot>
          <button type="button" onClick={childClick}>Click me</button>
        </Slot>,
      );

      await user.click(screen.getByRole("button"));

      expect(childClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("mergeProps — style", () => {
    it("shallow-merges style objects, child wins on collisions", () => {
      const { container } = render(
        <Slot style={{ color: "red", fontWeight: "bold" }}>
          <span style={{ color: "blue" }}>text</span>
        </Slot>,
      );

      const el = container.firstChild as HTMLElement;
      expect(el.style.color).toBe("blue");       // child wins on collision
      expect(el.style.fontWeight).toBe("bold");   // slot contributes non-colliding prop
    });
  });

  describe("mergeProps — className", () => {
    it("concatenates slot and child classNames", () => {
      render(
        <Slot className="slot-class">
          <span className="child-class">text</span>
        </Slot>,
      );

      expect(screen.getByText("text")).toHaveClass("slot-class", "child-class");
    });
  });
});
