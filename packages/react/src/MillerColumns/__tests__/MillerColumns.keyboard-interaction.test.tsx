import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MillerColumns } from "../MillerColumns";
import { verticalArrowCases } from "./MillerColumns.fixtures";

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

describe("MillerColumns — keyboard interaction", () => {
  describe("vertical navigation within a column", () => {
    it.each(verticalArrowCases)(
      "$key moves focus from $from to $to",
      async ({ key, from, to }) => {
        const user = userEvent.setup();

        render(<FlatList />);
        screen.getByRole("treeitem", { name: from }).focus();

        await user.keyboard(key);

        expect(screen.getByRole("treeitem", { name: to })).toHaveFocus();
      },
    );

    it("skips disabled items during arrow navigation", async () => {
      const user = userEvent.setup();

      render(
        <MillerColumns.Root>
          <MillerColumns.Column>
            <MillerColumns.Item value="a">A</MillerColumns.Item>
            <MillerColumns.Item value="b" disabled>
              B
            </MillerColumns.Item>
            <MillerColumns.Item value="c">C</MillerColumns.Item>
          </MillerColumns.Column>
        </MillerColumns.Root>,
      );
      screen.getByRole("treeitem", { name: "A" }).focus();

      await user.keyboard("{ArrowDown}");

      expect(screen.getByRole("treeitem", { name: "C" })).toHaveFocus();
    });
  });

  describe("activation", () => {
    it("Enter selects the focused item", async () => {
      const user = userEvent.setup();

      render(<FlatList />);
      const item = screen.getByRole("treeitem", { name: "B" });
      item.focus();

      await user.keyboard("{Enter}");

      expect(item).toHaveAttribute("aria-selected", "true");
    });

    it("Space selects the focused item", async () => {
      const user = userEvent.setup();

      render(<FlatList />);
      const item = screen.getByRole("treeitem", { name: "C" });
      item.focus();

      await user.keyboard(" ");

      expect(item).toHaveAttribute("aria-selected", "true");
    });

    it("Enter does not select a disabled focused item", async () => {
      const user = userEvent.setup();

      render(
        <MillerColumns.Root>
          <MillerColumns.Column>
            <MillerColumns.Item value="a">A</MillerColumns.Item>
            <MillerColumns.Item value="b" disabled>
              B
            </MillerColumns.Item>
          </MillerColumns.Column>
        </MillerColumns.Root>,
      );
      const item = screen.getByRole("treeitem", { name: "B" });
      item.focus();

      await user.keyboard("{Enter}");

      expect(item).toHaveAttribute("aria-selected", "false");
    });
  });
});
