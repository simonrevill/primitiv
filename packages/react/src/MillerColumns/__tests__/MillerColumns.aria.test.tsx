import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MillerColumns } from "../MillerColumns";

function Tree() {
  return (
    <MillerColumns.Root>
      <MillerColumns.Column>
        <MillerColumns.Item value="fruit">
          Fruit
          <MillerColumns.Column>
            <MillerColumns.Item value="apple">Apple</MillerColumns.Item>
          </MillerColumns.Column>
        </MillerColumns.Item>
        <MillerColumns.Item value="veg">Veg</MillerColumns.Item>
      </MillerColumns.Column>
    </MillerColumns.Root>
  );
}

describe("MillerColumns — aria", () => {
  it("nests treeitems inside group columns inside the tree", () => {
    render(<Tree />);

    const tree = screen.getByRole("tree");
    const column = within(tree).getByRole("group");
    expect(within(column).getByRole("treeitem", { name: "Fruit" })).toBeInTheDocument();
  });

  it("sets aria-level reflecting the column depth", async () => {
    const user = userEvent.setup();

    render(<Tree />);

    expect(screen.getByRole("treeitem", { name: "Fruit" })).toHaveAttribute(
      "aria-level",
      "1",
    );

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));

    expect(screen.getByRole("treeitem", { name: "Apple" })).toHaveAttribute(
      "aria-level",
      "2",
    );
  });

  it("sets aria-expanded on branch items only", async () => {
    const user = userEvent.setup();

    render(<Tree />);

    expect(screen.getByRole("treeitem", { name: "Fruit" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(
      screen.getByRole("treeitem", { name: "Veg" }),
    ).not.toHaveAttribute("aria-expanded");

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));

    expect(screen.getByRole("treeitem", { name: "Fruit" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("keeps a treeitem's accessible name to its own cell content", async () => {
    const user = userEvent.setup();

    render(<Tree />);

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));

    // Revealing the child column must not pollute the parent's name.
    expect(
      screen.getByRole("treeitem", { name: "Fruit" }),
    ).toBeInTheDocument();
  });
});
