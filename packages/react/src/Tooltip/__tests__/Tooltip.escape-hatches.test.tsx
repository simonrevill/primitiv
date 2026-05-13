import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tooltip } from "../Tooltip";

describe("Tooltip — escape hatches", () => {
  it("closes when pointer is pressed outside the content", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Tooltip.Provider>
          <Tooltip.Root defaultOpen>
            <Tooltip.Trigger>Hover me</Tooltip.Trigger>
            <Tooltip.Content>Tooltip text</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
        <button>Outside</button>
      </div>,
    );

    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Outside" }));

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("does not close when pointer is pressed inside the content", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>
            <button>Inside</button>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Inside" }));

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("does not close when onPointerDownOutside calls preventDefault()", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Tooltip.Provider>
          <Tooltip.Root defaultOpen>
            <Tooltip.Trigger>Hover me</Tooltip.Trigger>
            <Tooltip.Content
              onPointerDownOutside={(e) => e.preventDefault()}
            >
              Tooltip text
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
        <button>Outside</button>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Outside" }));

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });
});
