import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RadioGroup } from "../RadioGroup";

describe("RadioGroup keyboard interaction", () => {
  it("selects and focuses the next item on ArrowDown", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RadioGroup.Root aria-label="Colour" defaultValue="red">
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
        <RadioGroup.Item value="green">Green</RadioGroup.Item>
        <RadioGroup.Item value="blue">Blue</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const red = screen.getByRole("radio", { name: "Red" });
    const green = screen.getByRole("radio", { name: "Green" });
    red.focus();

    // Act
    await user.keyboard("{ArrowDown}");

    // Assert
    expect(green).toHaveFocus();
    expect(green).toHaveAttribute("aria-checked", "true");
    expect(red).toHaveAttribute("aria-checked", "false");
  });

  it("selects and focuses the next item on ArrowRight", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RadioGroup.Root aria-label="Colour" defaultValue="red">
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
        <RadioGroup.Item value="green">Green</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const red = screen.getByRole("radio", { name: "Red" });
    const green = screen.getByRole("radio", { name: "Green" });
    red.focus();

    // Act
    await user.keyboard("{ArrowRight}");

    // Assert
    expect(green).toHaveFocus();
    expect(green).toHaveAttribute("aria-checked", "true");
  });

  it("selects and focuses the previous item on ArrowUp", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RadioGroup.Root aria-label="Colour" defaultValue="green">
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
        <RadioGroup.Item value="green">Green</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const red = screen.getByRole("radio", { name: "Red" });
    const green = screen.getByRole("radio", { name: "Green" });
    green.focus();

    // Act
    await user.keyboard("{ArrowUp}");

    // Assert
    expect(red).toHaveFocus();
    expect(red).toHaveAttribute("aria-checked", "true");
  });

  it("selects and focuses the previous item on ArrowLeft", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RadioGroup.Root aria-label="Colour" defaultValue="green">
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
        <RadioGroup.Item value="green">Green</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const red = screen.getByRole("radio", { name: "Red" });
    const green = screen.getByRole("radio", { name: "Green" });
    green.focus();

    // Act
    await user.keyboard("{ArrowLeft}");

    // Assert
    expect(red).toHaveFocus();
    expect(red).toHaveAttribute("aria-checked", "true");
  });

  it("wraps from last to first on ArrowDown", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RadioGroup.Root aria-label="Colour" defaultValue="blue">
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
        <RadioGroup.Item value="blue">Blue</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const red = screen.getByRole("radio", { name: "Red" });
    const blue = screen.getByRole("radio", { name: "Blue" });
    blue.focus();

    // Act
    await user.keyboard("{ArrowDown}");

    // Assert
    expect(red).toHaveFocus();
    expect(red).toHaveAttribute("aria-checked", "true");
  });

  it("wraps from first to last on ArrowUp", async () => {
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
    red.focus();

    // Act
    await user.keyboard("{ArrowUp}");

    // Assert
    expect(blue).toHaveFocus();
    expect(blue).toHaveAttribute("aria-checked", "true");
  });

});
