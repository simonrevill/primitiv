import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ToggleGroup } from "../ToggleGroup";

describe("ToggleGroup asChild composition", () => {
  it("Root asChild renders the consumer's element instead of <div>", () => {
    render(
      <ToggleGroup.Root type="single" asChild aria-label="Alignment">
        <section>
          <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        </section>
      </ToggleGroup.Root>,
    );
    const group = screen.getByRole("group", { name: "Alignment" });
    expect(group.tagName).toBe("SECTION");
  });

  it("Root asChild merges role and data-orientation onto the child element", () => {
    render(
      <ToggleGroup.Root
        type="single"
        orientation="vertical"
        asChild
        aria-label="Alignment"
      >
        <section>
          <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        </section>
      </ToggleGroup.Root>,
    );
    const group = screen.getByRole("group", { name: "Alignment" });
    expect(group).toHaveAttribute("data-orientation", "vertical");
  });

  it("Item asChild renders the consumer's element instead of <button>", () => {
    render(
      <ToggleGroup.Root type="single" aria-label="Alignment">
        <ToggleGroup.Item value="left" asChild>
          <div>Left</div>
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    const item = screen.getByLabelText("Alignment").querySelector("[data-state]");
    expect(item?.tagName).toBe("DIV");
    expect(item).toHaveAttribute("aria-pressed", "false");
    expect(item).toHaveAttribute("data-state", "off");
  });

  it("Item asChild composes onClick with the toggle handler", async () => {
    const user = userEvent.setup();
    const consumerClick = vi.fn();
    render(
      <ToggleGroup.Root type="single" aria-label="Alignment">
        <ToggleGroup.Item value="left" asChild onClick={consumerClick}>
          <div>Left</div>
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    const item = screen.getByLabelText("Alignment").querySelector("[data-state]")!;
    await user.click(item);
    expect(consumerClick).toHaveBeenCalledOnce();
    expect(item).toHaveAttribute("aria-pressed", "true");
  });
});
