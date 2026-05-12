import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Toggle } from "../Toggle";

describe("Toggle uncontrolled state", () => {
  it("defaults to unpressed when no defaultPressed is supplied", () => {
    render(<Toggle aria-label="Bold" />);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("starts pressed when defaultPressed={true}", () => {
    render(<Toggle aria-label="Bold" defaultPressed />);
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-state", "on");
  });

  it("toggles from off to on on first click", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold" />);
    const button = screen.getByRole("button", { name: "Bold" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-state", "on");
  });

  it("toggles back to off on second click", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold" />);
    const button = screen.getByRole("button", { name: "Bold" });
    await user.click(button);
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAttribute("data-state", "off");
  });
});
