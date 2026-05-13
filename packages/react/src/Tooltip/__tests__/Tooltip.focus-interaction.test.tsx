import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tooltip } from "../Tooltip";

describe("Tooltip — focus interaction", () => {
  it("opens immediately when the trigger receives focus (no delay)", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider delayDuration={700}>
        <Tooltip.Root>
          <Tooltip.Trigger>Focusable</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.tab();

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("closes immediately when the trigger loses focus", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Focusable</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
        <button>Other</button>
      </Tooltip.Provider>,
    );

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.tab();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("opens on focus even when defaultOpen is false", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen={false}>
          <Tooltip.Trigger>Focusable</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.tab();

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("cancels the grace-period timer and closes when trigger loses focus during the grace window", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Tooltip.Provider delayDuration={0}>
          <Tooltip.Root>
            <Tooltip.Trigger>Focusable</Tooltip.Trigger>
            <Tooltip.Content>Tooltip text</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
        <button>Other</button>
      </div>,
    );

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.hover(screen.getByRole("button", { name: "Focusable" }));
    await user.unhover(screen.getByRole("button", { name: "Focusable" }));

    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.tab();

    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
