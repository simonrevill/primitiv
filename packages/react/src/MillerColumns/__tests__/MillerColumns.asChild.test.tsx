import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MillerColumns } from "../MillerColumns";

describe("MillerColumns — asChild", () => {
  it("renders the consumer element as the treeitem", () => {
    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.Item asChild value="a">
            <a href="#a">A</a>
          </MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    const item = screen.getByRole("treeitem", { name: "A" });
    expect(item.tagName).toBe("A");
    expect(item).toHaveAttribute("href", "#a");
  });

  it("merges selection behaviour onto the child element", async () => {
    const user = userEvent.setup();

    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.Item asChild value="a">
            <a href="#a">A</a>
          </MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    const item = screen.getByRole("treeitem", { name: "A" });
    await user.click(item);

    expect(item).toHaveAttribute("aria-selected", "true");
  });

  it("composes a consumer ref with the internal ref", () => {
    const ref = createRef<HTMLElement>();

    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.Item asChild value="a" ref={ref}>
            <a href="#a">A</a>
          </MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    expect(ref.current).toBe(screen.getByRole("treeitem", { name: "A" }));
  });

  it("composes a consumer onClick with selection", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.Item asChild value="a">
            <a href="#a" onClick={onClick}>
              A
            </a>
          </MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    await user.click(screen.getByRole("treeitem", { name: "A" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("treeitem", { name: "A" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("supports a branch item rendered with asChild", async () => {
    const user = userEvent.setup();

    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.Item asChild value="fruit">
            <a href="#fruit">Fruit</a>
            <MillerColumns.Column>
              <MillerColumns.Item value="apple">Apple</MillerColumns.Item>
            </MillerColumns.Column>
          </MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));

    expect(
      screen.getByRole("treeitem", { name: "Apple" }),
    ).toBeInTheDocument();
  });
});
