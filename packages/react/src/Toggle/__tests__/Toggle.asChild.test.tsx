import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Toggle } from "../Toggle";

describe("Toggle asChild composition", () => {
  it("renders the consumer's element instead of <button>", () => {
    render(
      <Toggle asChild aria-label="Bold">
        <div>B</div>
      </Toggle>,
    );
    // asChild swaps out the <button>; query by the label the consumer placed
    const toggle = screen.getByLabelText("Bold");
    expect(toggle.tagName).toBe("DIV");
  });

  it("merges aria-pressed and data-state onto the child element", () => {
    render(
      <Toggle asChild aria-label="Bold">
        <div>B</div>
      </Toggle>,
    );
    const toggle = screen.getByLabelText("Bold");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).toHaveAttribute("data-state", "off");
  });

  it("composes the consumer's onClick with the toggle handler", async () => {
    const user = userEvent.setup();
    const consumerClick = vi.fn();
    render(
      <Toggle asChild aria-label="Bold" onClick={consumerClick}>
        <div>B</div>
      </Toggle>,
    );
    const toggle = screen.getByLabelText("Bold");
    await user.click(toggle);
    expect(consumerClick).toHaveBeenCalledOnce();
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });
});
