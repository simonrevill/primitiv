import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MillerColumns } from "../MillerColumns";

describe("MillerColumns — uncontrolled state", () => {
  it("selects an item when it is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.Item value="a">A</MillerColumns.Item>
          <MillerColumns.Item value="b">B</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    const itemA = screen.getByRole("treeitem", { name: "A" });
    expect(itemA).toHaveAttribute("aria-selected", "false");

    await user.click(itemA);

    expect(itemA).toHaveAttribute("aria-selected", "true");
  });

  it("starts with the item named by defaultValue selected", () => {
    render(
      <MillerColumns.Root defaultValue={["b"]}>
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

  it("moving the selection within a column deselects the previous item", async () => {
    const user = userEvent.setup();

    render(
      <MillerColumns.Root defaultValue={["a"]}>
        <MillerColumns.Column>
          <MillerColumns.Item value="a">A</MillerColumns.Item>
          <MillerColumns.Item value="b">B</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    await user.click(screen.getByRole("treeitem", { name: "B" }));

    expect(screen.getByRole("treeitem", { name: "A" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("treeitem", { name: "B" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
