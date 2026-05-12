import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Toggle } from "../Toggle";

describe("Toggle controlled state", () => {
  it("reflects pressed={true} on mount", () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" pressed={true} onPressedChange={onPressedChange} />,
    );
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-state", "on");
  });

  it("reflects pressed={false} on mount", () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" pressed={false} onPressedChange={onPressedChange} />,
    );
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onPressedChange with true when clicked while unpressed", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" pressed={false} onPressedChange={onPressedChange} />,
    );
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(onPressedChange).toHaveBeenCalledOnce();
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("calls onPressedChange with false when clicked while pressed", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" pressed={true} onPressedChange={onPressedChange} />,
    );
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(onPressedChange).toHaveBeenCalledWith(false);
  });

  it("does not flip the UI without a re-render (controlled contract)", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" pressed={false} onPressedChange={onPressedChange} />,
    );
    const button = screen.getByRole("button", { name: "Bold" });
    await user.click(button);
    // Value stays false until parent provides a new pressed prop
    expect(button).toHaveAttribute("aria-pressed", "false");
  });
});
