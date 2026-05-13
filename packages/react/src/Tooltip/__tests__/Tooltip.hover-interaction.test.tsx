import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tooltip } from "../Tooltip";

describe("Tooltip — hover interaction", () => {
  it("opens after the delayDuration elapses on pointer enter", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider delayDuration={1}>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toBeInTheDocument(),
    );
  });

  it("cancels the open timer when pointer leaves before the delay elapses", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider delayDuration={500}>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));
    await user.unhover(screen.getByRole("button", { name: "Hover me" }));

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("opens immediately when a second tooltip is hovered while the first is open (skip-delay)", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider delayDuration={0} skipDelayDuration={5000}>
        <Tooltip.Root>
          <Tooltip.Trigger>First</Tooltip.Trigger>
          <Tooltip.Content>First tip</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger>Second</Tooltip.Trigger>
          <Tooltip.Content>Second tip</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.hover(screen.getByRole("button", { name: "First" }));
    expect(screen.getByText("First tip")).toBeInTheDocument();

    await user.hover(screen.getByRole("button", { name: "Second" }));

    expect(screen.getByText("Second tip")).toBeInTheDocument();
  });

  it("closes when the pointer leaves the trigger (disableHoverableContent=true)", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root disableHoverableContent>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.unhover(screen.getByRole("button", { name: "Hover me" }));
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("stays open when cursor moves from trigger into content (disableHoverableContent=false)", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.hover(screen.getByRole("tooltip"));

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("closes when the pointer leaves the content", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));
    await user.hover(screen.getByRole("tooltip"));
    await user.unhover(screen.getByRole("tooltip"));

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("clears the skip-delay timer when a tooltip opens again within the skip window", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider delayDuration={0} skipDelayDuration={5000}>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
        <button>Other</button>
      </Tooltip.Provider>,
    );

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.tab();
    expect(screen.queryByRole("tooltip")).toBeNull();

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("applies the full delay after the skip window expires", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Tooltip.Provider delayDuration={1} skipDelayDuration={1}>
          <Tooltip.Root>
            <Tooltip.Trigger>Hover me</Tooltip.Trigger>
            <Tooltip.Content>Tooltip text</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
        <button>Other</button>
      </div>,
    );

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.tab();
    expect(screen.queryByRole("tooltip")).toBeNull();

    await new Promise((r) => setTimeout(r, 20));

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toBeInTheDocument(),
    );
  });
});
