import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RadioGroup } from "../RadioGroup";

describe("RadioGroup uncontrolled state", () => {
  it("reflects defaultValue on mount", () => {
    // Arrange & Act
    render(
      <RadioGroup.Root aria-label="Colour" defaultValue="blue">
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
    expect(screen.getByRole("radio", { name: "Blue" })).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("selects an item on click and un-selects the previous one", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RadioGroup.Root aria-label="Colour" defaultValue="red">
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
        <RadioGroup.Item value="blue">Blue</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const red = screen.getByRole("radio", { name: "Red" });
    const blue = screen.getByRole("radio", { name: "Blue" });
    expect(red).toHaveAttribute("aria-checked", "true");

    // Act
    await user.click(blue);

    // Assert
    expect(red).toHaveAttribute("aria-checked", "false");
    expect(blue).toHaveAttribute("aria-checked", "true");
  });

  it("fires onValueChange with the new value on every distinct selection", async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup.Root aria-label="Colour" onValueChange={onValueChange}>
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
        <RadioGroup.Item value="blue">Blue</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    // Act
    await user.click(screen.getByRole("radio", { name: "Red" }));
    await user.click(screen.getByRole("radio", { name: "Blue" }));

    // Assert
    expect(onValueChange).toHaveBeenNthCalledWith(1, "red");
    expect(onValueChange).toHaveBeenNthCalledWith(2, "blue");
  });

  it("does not re-fire onValueChange when the already-selected item is clicked again", async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup.Root
        aria-label="Colour"
        defaultValue="red"
        onValueChange={onValueChange}
      >
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
        <RadioGroup.Item value="blue">Blue</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    // Act
    await user.click(screen.getByRole("radio", { name: "Red" }));
    await user.click(screen.getByRole("radio", { name: "Red" }));

    // Assert: the selection is already "red"; onValueChange should
    // stay quiet because nothing actually changed.
    expect(onValueChange).not.toHaveBeenCalled();
  });

});
