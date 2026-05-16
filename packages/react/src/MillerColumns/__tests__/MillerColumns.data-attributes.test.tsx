import { render, screen } from "@testing-library/react";
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

describe("MillerColumns — data attributes", () => {
  it("marks each projected column with a depth hook", async () => {
    const user = userEvent.setup();

    render(<Tree />);

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));

    const groups = screen.getAllByRole("group");
    expect(groups[0]).toHaveAttribute("data-miller-columns-column");
    expect(groups[0]).toHaveAttribute("data-depth", "0");
    expect(groups[1]).toHaveAttribute("data-depth", "1");
  });

  it("reflects selection through data-state", async () => {
    const user = userEvent.setup();

    render(<Tree />);

    const veg = screen.getByRole("treeitem", { name: "Veg" });
    expect(veg).toHaveAttribute("data-state", "unselected");

    await user.click(veg);

    expect(veg).toHaveAttribute("data-state", "selected");
  });

  it("flags branch items with data-has-children and omits it on leaves", () => {
    render(<Tree />);

    expect(screen.getByRole("treeitem", { name: "Fruit" })).toHaveAttribute(
      "data-has-children",
    );
    expect(
      screen.getByRole("treeitem", { name: "Veg" }),
    ).not.toHaveAttribute("data-has-children");
  });

  it("marks each item with its column depth", async () => {
    const user = userEvent.setup();

    render(<Tree />);

    expect(screen.getByRole("treeitem", { name: "Fruit" })).toHaveAttribute(
      "data-depth",
      "0",
    );

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));

    expect(screen.getByRole("treeitem", { name: "Apple" })).toHaveAttribute(
      "data-depth",
      "1",
    );
  });
});
