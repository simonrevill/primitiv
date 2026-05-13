import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tooltip } from "../Tooltip";

describe("Tooltip — asChild", () => {
  it("Trigger with asChild renders the consumer element instead of a button", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger asChild>
            <a href="/help">Help</a>
          </Tooltip.Trigger>
          <Tooltip.Content>Helpful tooltip</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const link = screen.getByRole("link", { name: "Help" });
    expect(link).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("Trigger with asChild merges aria-describedby onto the consumer element", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger asChild>
            <a href="/help">Help</a>
          </Tooltip.Trigger>
          <Tooltip.Content>Helpful tooltip</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const link = screen.getByRole("link", { name: "Help" });
    const tooltip = screen.getByRole("tooltip");
    expect(link).toHaveAttribute("aria-describedby", tooltip.id);
  });

  it("Trigger with asChild still opens the tooltip on focus", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <a href="/help">Help</a>
          </Tooltip.Trigger>
          <Tooltip.Content>Helpful tooltip</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.tab();

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("Arrow with asChild renders the consumer element", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>
            Tooltip text
            <Tooltip.Arrow asChild>
              <svg data-testid="arrow-svg" />
            </Tooltip.Arrow>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByTestId("arrow-svg")).toBeInTheDocument();
    expect(screen.queryByRole("tooltip")?.querySelector("span")).toBeNull();
  });
});
