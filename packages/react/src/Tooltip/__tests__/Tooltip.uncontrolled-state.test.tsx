import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tooltip } from "../Tooltip";

describe("Tooltip — uncontrolled state", () => {
  it("is closed by default when defaultOpen is not set", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("is open by default when defaultOpen={true}", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("opens immediately when the trigger is focused", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
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
  });
});
