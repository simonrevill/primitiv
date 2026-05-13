import { render, screen } from "@testing-library/react";

import { Tooltip } from "../Tooltip";

describe("Tooltip — basic rendering", () => {
  it("renders Tooltip.Trigger as a button with type='button'", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const trigger = screen.getByRole("button", { name: "Hover me" });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("type", "button");
  });

  it("does not render Tooltip.Content when closed by default", () => {
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

  it("renders Tooltip.Content with role='tooltip' when open", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text");
  });

  it("wires aria-describedby on Trigger to the id of Content", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const trigger = screen.getByRole("button", { name: "Hover me" });
    const tooltip = screen.getByRole("tooltip");
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
    expect(tooltip.id).not.toBe("");
  });

  it("sets data-state='closed' on Content when closed (forceMount)", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content forceMount>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByRole("tooltip")).toHaveAttribute("data-state", "closed");
  });

  it("sets data-state='open' on Content when open", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByRole("tooltip")).toHaveAttribute("data-state", "open");
  });

  it("sets data-state='open' | 'closed' on Trigger to reflect state", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByRole("button", { name: "Hover me" })).toHaveAttribute(
      "data-state",
      "open",
    );
  });

  it("Tooltip.Portal renders children into document.body when open", () => {
    render(
      <section data-testid="tree-root">
        <Tooltip.Provider>
          <Tooltip.Root defaultOpen>
            <Tooltip.Trigger>Hover me</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>Tooltip text</Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </section>,
    );

    const tooltip = screen.getByRole("tooltip");
    expect(document.body).toContainElement(tooltip);
    expect(screen.getByTestId("tree-root")).not.toContainElement(tooltip);
  });

  it("Tooltip.Portal does not render children when closed", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>Tooltip text</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("Tooltip.Arrow renders a span inside the content", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content>
            Tooltip text
            <Tooltip.Arrow data-testid="arrow" />
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByTestId("arrow")).toBeInTheDocument();
  });

  it("forwards arbitrary attributes to Trigger", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger className="my-trigger" data-testid="trigger">
            Hover me
          </Tooltip.Trigger>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByTestId("trigger")).toHaveClass("my-trigger");
  });

  it("forwards arbitrary attributes to Content", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Content className="my-content">Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByRole("tooltip")).toHaveClass("my-content");
  });
});
