import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { RadioCard } from "../RadioCard";

describe("RadioCard controlled state", () => {
  it("reflects the value prop as the selected item", () => {
    // Arrange & Act
    render(
      <RadioCard.Root aria-label="Plan" value="pro" onValueChange={() => {}}>
        <RadioCard.Item value="starter">Starter</RadioCard.Item>
        <RadioCard.Item value="pro">Pro</RadioCard.Item>
      </RadioCard.Root>,
    );

    // Assert
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Starter" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("fires onValueChange with the new value when a different item is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioCard.Root
        aria-label="Plan"
        value="starter"
        onValueChange={onValueChange}
      >
        <RadioCard.Item value="starter">Starter</RadioCard.Item>
        <RadioCard.Item value="pro">Pro</RadioCard.Item>
      </RadioCard.Root>,
    );

    // Act
    await user.click(screen.getByRole("radio", { name: "Pro" }));

    // Assert
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith("pro");
  });

  it("does not change selection when the parent ignores onValueChange", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RadioCard.Root aria-label="Plan" value="starter" onValueChange={() => {}}>
        <RadioCard.Item value="starter">Starter</RadioCard.Item>
        <RadioCard.Item value="pro">Pro</RadioCard.Item>
      </RadioCard.Root>,
    );

    // Act
    await user.click(screen.getByRole("radio", { name: "Pro" }));

    // Assert — controlled value not updated, starter stays selected
    expect(screen.getByRole("radio", { name: "Starter" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("updates the selected item when value prop changes", async () => {
    // Arrange
    function Wrapper() {
      const [value, setValue] = useState("starter");
      return (
        <>
          <button onClick={() => setValue("pro")}>Switch to Pro</button>
          <RadioCard.Root aria-label="Plan" value={value} onValueChange={setValue}>
            <RadioCard.Item value="starter">Starter</RadioCard.Item>
            <RadioCard.Item value="pro">Pro</RadioCard.Item>
          </RadioCard.Root>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Wrapper />);

    // Act & Assert initial
    expect(screen.getByRole("radio", { name: "Starter" })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Switch to Pro" }));

    // Assert updated
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });
});
