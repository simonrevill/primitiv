import { fireEvent, render, screen } from "@testing-library/react";

import { RadioGroup } from "../RadioGroup";

describe("RadioGroup arrow-key guards for disabled focus", () => {
  it("does nothing when the focused item is disabled but others are enabled", () => {
    // Arrange: `asChild` onto `<li>` so `disabled` doesn't prevent
    // the item from receiving focus / keydown the way a native
    // `<button disabled>` would.
    const onValueChange = vi.fn();
    render(
      <RadioGroup.Root aria-label="Colour" onValueChange={onValueChange}>
        <RadioGroup.Item value="red" disabled asChild>
          <li>Red</li>
        </RadioGroup.Item>
        <RadioGroup.Item value="blue">Blue</RadioGroup.Item>
        <RadioGroup.Item value="green">Green</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const red = screen.getByRole("radio", { name: "Red" });

    // Act: press ArrowRight while focus is on a disabled item
    fireEvent.keyDown(red, { key: "ArrowRight" });

    // Assert: nothing selected — the keydown handler bailed on the
    // "focused item is not in enabledValues" guard.
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "Blue" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("radio", { name: "Green" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("does nothing when every item in the group is disabled", () => {
    // Arrange: a pre-selected but disabled item. Without the guard,
    // `enabledValues.length` is zero, `nextIndex` comes out as `NaN`
    // (zero-modulo), `nextValue` is `undefined`, and `select(undefined)`
    // would then wipe the selection and fire `onValueChange(undefined)`.
    const onValueChange = vi.fn();
    render(
      <RadioGroup.Root
        aria-label="Colour"
        defaultValue="red"
        onValueChange={onValueChange}
      >
        <RadioGroup.Item value="red" disabled asChild>
          <li>Red</li>
        </RadioGroup.Item>
        <RadioGroup.Item value="blue" disabled asChild>
          <li>Blue</li>
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const red = screen.getByRole("radio", { name: "Red" });
    expect(red).toHaveAttribute("aria-checked", "true");

    // Act
    fireEvent.keyDown(red, { key: "ArrowRight" });

    // Assert: the pre-existing selection survives and no callback fires.
    expect(onValueChange).not.toHaveBeenCalled();
    expect(red).toHaveAttribute("aria-checked", "true");
  });
});
