import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Toggle } from "../Toggle";

describe("Toggle disabled", () => {
  it("sets the native disabled attribute", () => {
    render(<Toggle aria-label="Bold" disabled />);
    expect(screen.getByRole("button", { name: "Bold" })).toBeDisabled();
  });

  it('sets data-disabled="" when disabled', () => {
    render(<Toggle aria-label="Bold" disabled />);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "data-disabled",
      "",
    );
  });

  it("does not set data-disabled when not disabled", () => {
    render(<Toggle aria-label="Bold" />);
    expect(
      screen.getByRole("button", { name: "Bold" }),
    ).not.toHaveAttribute("data-disabled");
  });

  it("does not toggle state when clicked while disabled", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold" disabled />);
    const button = screen.getByRole("button", { name: "Bold" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });
});
