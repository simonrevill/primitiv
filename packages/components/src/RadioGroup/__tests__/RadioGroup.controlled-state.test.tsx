import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { RadioGroup } from "../RadioGroup";

describe("RadioGroup controlled state", () => {
  it("reflects the controlled `value` prop", () => {
    // Arrange & Act
    const { rerender } = render(
      <RadioGroup.Root
        aria-label="Colour"
        value="red"
        onValueChange={() => {}}
      >
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
        <RadioGroup.Item value="blue">Blue</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    expect(screen.getByRole("radio", { name: "Red" })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    rerender(
      <RadioGroup.Root
        aria-label="Colour"
        value="blue"
        onValueChange={() => {}}
      >
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
        <RadioGroup.Item value="blue">Blue</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    // Assert
    expect(screen.getByRole("radio", { name: "Red" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("radio", { name: "Blue" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("does not update rendered state when the parent refuses to update `value`", async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup.Root
        aria-label="Colour"
        value="red"
        onValueChange={onValueChange}
      >
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
        <RadioGroup.Item value="blue">Blue</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const blue = screen.getByRole("radio", { name: "Blue" });

    // Act
    await user.click(blue);

    // Assert: callback fires but the pinned `value` prop keeps the
    // rendered state on "red".
    expect(onValueChange).toHaveBeenCalledWith("blue");
    expect(screen.getByRole("radio", { name: "Red" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(blue).toHaveAttribute("aria-checked", "false");
  });

  it("lets a parent drive the value end to end", async () => {
    // Arrange
    const user = userEvent.setup();
    function Harness() {
      // Start on "blue" so the pre-click state can only be correct if
      // the controlled prop is honoured — a broken impl would fall back
      // to defaultValue and render nothing selected.
      const [value, setValue] = useState("blue");
      return (
        <RadioGroup.Root
          aria-label="Colour"
          value={value}
          onValueChange={setValue}
        >
          <RadioGroup.Item value="red">Red</RadioGroup.Item>
          <RadioGroup.Item value="blue">Blue</RadioGroup.Item>
        </RadioGroup.Root>
      );
    }
    render(<Harness />);
    const red = screen.getByRole("radio", { name: "Red" });
    const blue = screen.getByRole("radio", { name: "Blue" });
    expect(blue).toHaveAttribute("aria-checked", "true");

    // Act & Assert
    await user.click(red);
    expect(red).toHaveAttribute("aria-checked", "true");
    expect(blue).toHaveAttribute("aria-checked", "false");

    await user.click(blue);
    expect(blue).toHaveAttribute("aria-checked", "true");
    expect(red).toHaveAttribute("aria-checked", "false");
  });
});
