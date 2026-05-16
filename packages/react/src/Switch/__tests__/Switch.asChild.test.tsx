import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Switch } from "../Switch";

describe("Switch asChild", () => {
  it("renders the Root as the consumer element when asChild is set", () => {
    // Arrange & Act
    render(
      <Switch.Root asChild aria-label="Enable notifications">
        <div>Toggle</div>
      </Switch.Root>,
    );

    // Assert — div rendered, not button; role and aria-checked merged
    const sw = screen.getByRole("switch", { name: "Enable notifications" });
    expect(sw.tagName).toBe("DIV");
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("merges onClick and toggles state on the asChild Root element", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Switch.Root asChild aria-label="Enable notifications" onClick={onClick}>
        <div>Toggle</div>
      </Switch.Root>,
    );

    // Act
    await user.click(screen.getByRole("switch", { name: "Enable notifications" }));

    // Assert — consumer onClick ran and state toggled
    expect(onClick).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("switch", { name: "Enable notifications" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("renders the Thumb as the consumer element when asChild is set", () => {
    // Arrange & Act
    render(
      <Switch.Root aria-label="Enable notifications">
        <Switch.Thumb asChild>
          <span data-testid="custom-thumb" />
        </Switch.Thumb>
      </Switch.Root>,
    );

    // Assert — our span rendered; aria-hidden and data-state merged onto it
    const thumb = screen.getByTestId("custom-thumb");
    expect(thumb).toHaveAttribute("aria-hidden", "true");
    expect(thumb).toHaveAttribute("data-state", "unchecked");
  });
});
