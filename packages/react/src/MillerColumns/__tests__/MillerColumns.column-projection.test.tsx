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

describe("MillerColumns — column projection", () => {
  it("does not render a child column until its parent item is selected", () => {
    render(<Tree />);

    expect(
      screen.queryByRole("treeitem", { name: "Apple" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("group")).toHaveLength(1);
  });

  it("reveals the child column when the parent item is selected", async () => {
    const user = userEvent.setup();

    render(<Tree />);

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));

    expect(screen.getAllByRole("group")).toHaveLength(2);
    expect(
      screen.getByRole("treeitem", { name: "Apple" }),
    ).toBeInTheDocument();
  });

  it("projects the child column into the same strip as its parent", async () => {
    const user = userEvent.setup();

    render(<Tree />);

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));

    const strip = screen.getByRole("tree");
    const columns = within(strip).getAllByRole("group");
    expect(columns).toHaveLength(2);
  });

  it("hides the child column again when a sibling is selected", async () => {
    const user = userEvent.setup();

    render(<Tree />);

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));
    await user.click(screen.getByRole("treeitem", { name: "Veg" }));

    expect(
      screen.queryByRole("treeitem", { name: "Apple" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("group")).toHaveLength(1);
  });

  it("detects a child column declared inside a fragment", async () => {
    const user = userEvent.setup();

    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.Item value="fruit">
            Fruit
            <>
              <MillerColumns.ItemIndicator data-testid="indicator">
                ▸
              </MillerColumns.ItemIndicator>
              <MillerColumns.Column>
                <MillerColumns.Item value="apple">Apple</MillerColumns.Item>
              </MillerColumns.Column>
            </>
          </MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    // The fragment-wrapped column is a child column: hidden until selected,
    // and its presence is reflected on the branch item.
    expect(
      screen.queryByRole("treeitem", { name: "Apple" }),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("indicator")).toBeInTheDocument();

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));

    expect(
      screen.getByRole("treeitem", { name: "Apple" }),
    ).toBeInTheDocument();
  });
});
