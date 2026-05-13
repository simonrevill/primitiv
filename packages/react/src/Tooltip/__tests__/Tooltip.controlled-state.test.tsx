import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Tooltip } from "../Tooltip";

describe("Tooltip — controlled state", () => {
  it("reflects the consumer's open={true} prop", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root open={true}>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("reflects the consumer's open={false} prop", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root open={false}>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("calls onOpenChange(true) when the trigger is focused in controlled mode", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip.Provider>
        <Tooltip.Root open={false} onOpenChange={onOpenChange}>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.tab();

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange(false) when trigger loses focus in controlled mode", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip.Provider>
        <Tooltip.Root open={true} onOpenChange={onOpenChange}>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
        <button>Other</button>
      </Tooltip.Provider>,
    );

    await user.tab();
    await user.tab();

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not flip state internally when controlled — consumer must drive open", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip.Provider>
        <Tooltip.Root open={false} onOpenChange={onOpenChange}>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.tab();

    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("updates when the consumer drives state through onOpenChange", async () => {
    function Wrapper() {
      const [open, setOpen] = useState(false);
      return (
        <Tooltip.Provider>
          <Tooltip.Root open={open} onOpenChange={setOpen}>
            <Tooltip.Trigger>Hover me</Tooltip.Trigger>
            <Tooltip.Content>Tooltip text</Tooltip.Content>
          </Tooltip.Root>
          <button>Other</button>
        </Tooltip.Provider>
      );
    }

    const user = userEvent.setup();
    render(<Wrapper />);

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.tab();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("calls onOpenChange from uncontrolled mode too", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip.Provider>
        <Tooltip.Root onOpenChange={onOpenChange}>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.tab();

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
