import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Toggle } from "../Toggle";

describe("Toggle keyboard interaction", () => {
  it("toggles on when Space is pressed while unpressed", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold" />);
    const button = screen.getByRole("button", { name: "Bold" });
    button.focus();
    await user.keyboard(" ");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles off when Space is pressed while pressed", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold" defaultPressed />);
    const button = screen.getByRole("button", { name: "Bold" });
    button.focus();
    await user.keyboard(" ");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles on when Enter is pressed while unpressed", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold" />);
    const button = screen.getByRole("button", { name: "Bold" });
    button.focus();
    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("does not respond to keyboard while disabled", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold" disabled />);
    const button = screen.getByRole("button", { name: "Bold" });
    button.focus();
    await user.keyboard(" ");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });
});
