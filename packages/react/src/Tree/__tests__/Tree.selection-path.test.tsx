import { useState } from "react";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tree, useTreePath } from "../../Tree";
import type { TreePathSegment } from "../../Tree";

function PathProbe({ value }: { value: string }) {
  const path = useTreePath(value);
  return <pre data-testid={`path-${value}`}>{JSON.stringify(path)}</pre>;
}

function readPath(value: string): TreePathSegment[] {
  return JSON.parse(screen.getByTestId(`path-${value}`).textContent ?? "[]");
}

describe("Tree selection-path tests", () => {
  describe("useTreePath", () => {
    it("should return the root-to-leaf path of an item with labels carried from props", () => {
      // Arrange
      render(
        <Tree.Root defaultExpandedValues={["src", "components"]}>
          <Tree.Branch value="src" label="src">
            <Tree.BranchControl>src</Tree.BranchControl>
            <Tree.BranchContent>
              <Tree.Branch value="components" label="components">
                <Tree.BranchControl>components</Tree.BranchControl>
                <Tree.BranchContent>
                  <Tree.Item value="button" label="button.tsx">
                    button.tsx
                  </Tree.Item>
                </Tree.BranchContent>
              </Tree.Branch>
            </Tree.BranchContent>
          </Tree.Branch>
          <PathProbe value="button" />
        </Tree.Root>,
      );

      // Assert
      const path = readPath("button");

      expect(path.map((segment) => segment.value)).toEqual([
        "src",
        "components",
        "button",
      ]);
      expect(path.map((segment) => segment.label)).toEqual([
        "src",
        "components",
        "button.tsx",
      ]);
      expect(path.map((segment) => segment.isBranch)).toEqual([
        true,
        true,
        false,
      ]);
    });

    it("should still resolve the path after an ancestor branch collapses and unmounts its descendants", async () => {
      // Arrange
      function Fixture() {
        const [expanded, setExpanded] = useState<string[]>(["src"]);
        return (
          <>
            <button type="button" onClick={() => setExpanded([])}>
              collapse
            </button>
            <Tree.Root
              expandedValues={expanded}
              onExpandedChange={setExpanded}
            >
              <Tree.Branch value="src" label="src">
                <Tree.BranchControl>src</Tree.BranchControl>
                <Tree.BranchContent>
                  <Tree.Item value="button" label="button.tsx">
                    button.tsx
                  </Tree.Item>
                </Tree.BranchContent>
              </Tree.Branch>
              <PathProbe value="button" />
            </Tree.Root>
          </>
        );
      }

      const user = userEvent.setup();
      render(<Fixture />);

      // Sanity: while expanded, the path is fully resolved.
      expect(readPath("button").map((segment) => segment.value)).toEqual([
        "src",
        "button",
      ]);

      // Act — collapse the branch; its content (and the descendant item)
      // is unmounted because `forceMount` is not used.
      await user.click(screen.getByRole("button", { name: "collapse" }));

      // Assert — ancestry is still resolvable from the persisted registry.
      const path = readPath("button");
      expect(path.map((segment) => segment.value)).toEqual([
        "src",
        "button",
      ]);
      expect(path.map((segment) => segment.label)).toEqual([
        "src",
        "button.tsx",
      ]);
    });
  });

  describe("Tree.SelectionPath default rendering", () => {
    it("should render the wrapper with data-empty when no item is selected", () => {
      // Arrange
      render(
        <Tree.Root>
          <Tree.Item value="readme" label="readme.md">
            readme.md
          </Tree.Item>
          <Tree.SelectionPath data-testid="path" />
        </Tree.Root>,
      );

      // Assert
      const wrapper = screen.getByTestId("path");

      expect(wrapper).toHaveAttribute("data-empty", "");
      expect(wrapper).not.toContainElement(screen.queryByRole("navigation"));
    });

    it("should render one Breadcrumb trail for a single selected item, with the final segment as the current page", () => {
      // Arrange
      render(
        <Tree.Root
          defaultExpandedValues={["src"]}
          defaultSelectedValue="button"
        >
          <Tree.Branch value="src" label="src">
            <Tree.BranchControl>src</Tree.BranchControl>
            <Tree.BranchContent>
              <Tree.Item value="button" label="button.tsx">
                button.tsx
              </Tree.Item>
            </Tree.BranchContent>
          </Tree.Branch>
          <Tree.SelectionPath data-testid="path" />
        </Tree.Root>,
      );

      // Assert
      const wrapper = screen.getByTestId("path");

      expect(wrapper).not.toHaveAttribute("data-empty");

      const trails = within(wrapper).getAllByRole("navigation", {
        name: "Breadcrumb",
      });
      expect(trails).toHaveLength(1);
      expect(trails[0]).toHaveTextContent(/src/);
      expect(trails[0]).toHaveTextContent(/button\.tsx/);

      // The leaf label is the current page, not a link.
      const current = within(trails[0]).getByText("button.tsx");
      expect(current).toHaveAttribute("aria-current", "page");
    });
  });
});
