import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ToggleGroup } from "../ToggleGroup";

function Fixture({
  defaultValue,
  value,
  onValueChange,
}: {
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (v: string[]) => void;
}) {
  if (value !== undefined || onValueChange) {
    return (
      <ToggleGroup.Root
        type="multiple"
        value={value!}
        onValueChange={onValueChange!}
        aria-label="Formatting"
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
      </ToggleGroup.Root>
    );
  }
  return (
    <ToggleGroup.Root
      type="multiple"
      defaultValue={defaultValue}
      aria-label="Formatting"
    >
      <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

describe("ToggleGroup multiple mode — uncontrolled", () => {
  it("starts with no items pressed when defaultValue is omitted", () => {
    render(<Fixture />);
    for (const name of ["Bold", "Italic", "Underline"]) {
      expect(screen.getByRole("button", { name })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    }
  });

  it("starts with defaultValue items pressed", () => {
    render(<Fixture defaultValue={["bold", "italic"]} />);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Underline" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("clicking an item adds it to the pressed set without affecting others", async () => {
    const user = userEvent.setup();
    render(<Fixture defaultValue={["bold"]} />);
    await user.click(screen.getByRole("button", { name: "Italic" }));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("clicking an active item removes it from the pressed set", async () => {
    const user = userEvent.setup();
    render(<Fixture defaultValue={["bold", "italic"]} />);
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("all items can be pressed simultaneously", async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    for (const name of ["Bold", "Italic", "Underline"]) {
      await user.click(screen.getByRole("button", { name }));
    }
    for (const name of ["Bold", "Italic", "Underline"]) {
      expect(screen.getByRole("button", { name })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    }
  });
});

describe("ToggleGroup multiple mode — controlled", () => {
  it("reflects the controlled value array", () => {
    render(<Fixture value={["bold", "underline"]} onValueChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Underline" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("calls onValueChange with the updated array when adding an item", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Fixture value={["bold"]} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Italic" }));
    expect(onValueChange).toHaveBeenCalledWith(["bold", "italic"]);
  });

  it("calls onValueChange with the updated array when removing an item", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Fixture value={["bold", "italic"]} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(onValueChange).toHaveBeenCalledWith(["italic"]);
  });
});
