import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tooltip } from "../Tooltip";

describe("Tooltip — keyboard interaction", () => {
  it("closes when Escape is pressed while the tooltip is open", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Focusable</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("fires onEscapeKeyDown when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onEscapeKeyDown = vi.fn();

    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Focusable</Tooltip.Trigger>
          <Tooltip.Content onEscapeKeyDown={onEscapeKeyDown}>
            Tooltip text
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.keyboard("{Escape}");

    expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
  });

  it("keeps the tooltip open when onEscapeKeyDown calls preventDefault()", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Focusable</Tooltip.Trigger>
          <Tooltip.Content
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            Tooltip text
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.keyboard("{Escape}");

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("closes when Escape is pressed on the trigger while open via focus", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Focusable</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
