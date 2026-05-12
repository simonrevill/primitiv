import { render, screen } from "@testing-library/react";

import { ToggleGroup } from "../ToggleGroup";

describe("ToggleGroup basic rendering", () => {
  it('Root renders a <div role="group">', () => {
    render(
      <ToggleGroup.Root type="single" aria-label="Alignment">
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(screen.getByRole("group", { name: "Alignment" })).toBeInTheDocument();
  });

  it('Item renders a <button type="button" aria-pressed>', () => {
    render(
      <ToggleGroup.Root type="single" aria-label="Alignment">
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    const item = screen.getByRole("button", { name: "Left" });
    expect(item.tagName).toBe("BUTTON");
    expect(item).toHaveAttribute("type", "button");
    expect(item).toHaveAttribute("aria-pressed", "false");
  });

  it('Item defaults data-state to "off" when unpressed', () => {
    render(
      <ToggleGroup.Root type="single" aria-label="Alignment">
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "data-state",
      "off",
    );
  });

  it('Root sets data-orientation="horizontal" by default', () => {
    render(
      <ToggleGroup.Root type="single" aria-label="Alignment">
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(screen.getByRole("group", { name: "Alignment" })).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });
});
