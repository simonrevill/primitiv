import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MillerColumns } from "../MillerColumns";

describe("MillerColumns — controlled state", () => {
  it("reflects the value prop as the active path", () => {
    render(
      <MillerColumns.Root value={["b"]} onValueChange={() => {}}>
        <MillerColumns.Column>
          <MillerColumns.Item value="a">A</MillerColumns.Item>
          <MillerColumns.Item value="b">B</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    expect(screen.getByRole("treeitem", { name: "B" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("treeitem", { name: "A" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("calls onValueChange with the next path when an item is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <MillerColumns.Root value={[]} onValueChange={onValueChange}>
        <MillerColumns.Column>
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    await user.click(screen.getByRole("treeitem", { name: "A" }));

    expect(onValueChange).toHaveBeenCalledWith(["a"]);
  });

  it("does not move the selection unless the value prop changes", async () => {
    const user = userEvent.setup();

    render(
      <MillerColumns.Root value={[]} onValueChange={() => {}}>
        <MillerColumns.Column>
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    await user.click(screen.getByRole("treeitem", { name: "A" }));

    expect(screen.getByRole("treeitem", { name: "A" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("follows an external value update", () => {
    const { rerender } = render(
      <MillerColumns.Root value={[]} onValueChange={() => {}}>
        <MillerColumns.Column>
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    expect(screen.getByRole("treeitem", { name: "A" })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    rerender(
      <MillerColumns.Root value={["a"]} onValueChange={() => {}}>
        <MillerColumns.Column>
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    expect(screen.getByRole("treeitem", { name: "A" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
