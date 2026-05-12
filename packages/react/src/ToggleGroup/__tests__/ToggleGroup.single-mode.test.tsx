import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ToggleGroup } from "../ToggleGroup";

function Fixture({
  defaultValue,
  value,
  onValueChange,
}: {
  defaultValue?: string;
  value?: string | undefined;
  onValueChange?: (v: string | undefined) => void;
}) {
  if (value !== undefined || onValueChange) {
    return (
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={onValueChange!}
        aria-label="Alignment"
      >
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
        <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
      </ToggleGroup.Root>
    );
  }
  return (
    <ToggleGroup.Root
      type="single"
      defaultValue={defaultValue}
      aria-label="Alignment"
    >
      <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
      <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

describe("ToggleGroup single mode — uncontrolled", () => {
  it("starts with no item pressed when defaultValue is omitted", () => {
    render(<Fixture />);
    for (const name of ["Left", "Center", "Right"]) {
      expect(screen.getByRole("button", { name })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    }
  });

  it("starts with the defaultValue item pressed", () => {
    render(<Fixture defaultValue="center" />);
    expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("pressing an unpressed item presses it and unpresses the previously pressed item", async () => {
    const user = userEvent.setup();
    render(<Fixture defaultValue="left" />);
    await user.click(screen.getByRole("button", { name: "Center" }));
    expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("pressing the active item deselects it (toggle-off)", async () => {
    const user = userEvent.setup();
    render(<Fixture defaultValue="left" />);
    await user.click(screen.getByRole("button", { name: "Left" }));
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it('sets data-state="on" on the pressed item and "off" on others', async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    await user.click(screen.getByRole("button", { name: "Right" }));
    expect(screen.getByRole("button", { name: "Right" })).toHaveAttribute(
      "data-state",
      "on",
    );
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "data-state",
      "off",
    );
  });
});

describe("ToggleGroup single mode — controlled", () => {
  it("reflects the controlled value", () => {
    render(<Fixture value="center" onValueChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("calls onValueChange with the new value when a different item is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Fixture value="left" onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Center" }));
    expect(onValueChange).toHaveBeenCalledWith("center");
  });

  it("calls onValueChange with undefined when the active item is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Fixture value="left" onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Left" }));
    expect(onValueChange).toHaveBeenCalledWith(undefined);
  });

  it("does not flip the UI without a re-render (controlled contract)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Fixture value="left" onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Center" }));
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
