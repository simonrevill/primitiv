import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MillerColumns } from "../MillerColumns";

function FlatList() {
  return (
    <MillerColumns.Root>
      <MillerColumns.Column>
        <MillerColumns.Item value="a">A</MillerColumns.Item>
        <MillerColumns.Item value="b">B</MillerColumns.Item>
        <MillerColumns.Item value="c">C</MillerColumns.Item>
      </MillerColumns.Column>
    </MillerColumns.Root>
  );
}

function Tree({ defaultValue }: { defaultValue?: string[] }) {
  return (
    <MillerColumns.Root defaultValue={defaultValue}>
      <MillerColumns.Column>
        <MillerColumns.Item value="fruit">
          Fruit
          <MillerColumns.Column>
            <MillerColumns.Item value="apple">Apple</MillerColumns.Item>
          </MillerColumns.Column>
        </MillerColumns.Item>
      </MillerColumns.Column>
    </MillerColumns.Root>
  );
}

describe("MillerColumns — roving tabindex", () => {
  it("exposes the first root item as the only tabstop initially", () => {
    render(<FlatList />);

    expect(screen.getByRole("treeitem", { name: "A" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("treeitem", { name: "B" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByRole("treeitem", { name: "C" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("moves the tabstop to whichever item is focused", async () => {
    const user = userEvent.setup();

    render(<FlatList />);
    screen.getByRole("treeitem", { name: "A" }).focus();

    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("treeitem", { name: "B" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("treeitem", { name: "A" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("uses the deepest selected item as the default tabstop", () => {
    render(<Tree defaultValue={["fruit", "apple"]} />);

    expect(screen.getByRole("treeitem", { name: "Apple" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("treeitem", { name: "Fruit" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("lands Tab on the single tabstop", async () => {
    const user = userEvent.setup();

    render(<FlatList />);

    await user.tab();

    expect(screen.getByRole("treeitem", { name: "A" })).toHaveFocus();
  });
});
