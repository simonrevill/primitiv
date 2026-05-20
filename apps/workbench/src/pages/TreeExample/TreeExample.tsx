import { useState } from "react";

import { Breadcrumb, Tree } from "@primitiv/react";
import { ChevronRight } from "@primitiv/icons";

import "./TreeExample.scss";

type SelectionMode = "single" | "multiple";

/** Maps every tree value to its display label and optional parent value. */
const TREE_META: Record<string, { label: string; parent?: string }> = {
  readme: { label: "readme.md" },
  src: { label: "src" },
  index: { label: "index.ts", parent: "src" },
  components: { label: "components", parent: "src" },
  button: { label: "button.tsx", parent: "components" },
  dialog: { label: "dialog.tsx", parent: "components" },
  legacy: { label: "legacy.tsx", parent: "components" },
  utils: { label: "utils.ts", parent: "src" },
  docs: { label: "docs" },
  guides: { label: "guides.md", parent: "docs" },
  pkg: { label: "package.json" },
};

/** Returns ordered path segments from root → leaf for the given value. */
function getPath(value: string): string[] {
  const path: string[] = [];
  let current: string | undefined = value;
  while (current) {
    const meta: { label: string; parent?: string } | undefined =
      TREE_META[current];
    if (!meta) break;
    path.unshift(meta.label);
    current = meta.parent;
  }
  return path;
}

function SelectionBreadcrumbs({ paths }: { paths: string[][] }) {
  return (
    <div className="tree-example__path-bar">
      {paths.length === 0 ? (
        <span className="tree-example__path-bar-empty">—</span>
      ) : (
        paths.map((path, i) => (
          <Breadcrumb.Root key={i}>
            <Breadcrumb.List>
              {path.slice(0, -1).flatMap((segment, j) => [
                <Breadcrumb.Item key={`item-${j}`}>
                  <Breadcrumb.Link asChild>
                    <span>{segment}</span>
                  </Breadcrumb.Link>
                </Breadcrumb.Item>,
                <Breadcrumb.Separator key={`sep-${j}`}>
                  <ChevronRight />
                </Breadcrumb.Separator>,
              ])}
              <Breadcrumb.Item key="current">
                <Breadcrumb.Page>{path[path.length - 1]}</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        ))
      )}
    </div>
  );
}

export function TreeExample() {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("single");
  const [selectedValue, setSelectedValue] = useState<string | null>("readme");
  const [selectedValues, setSelectedValues] = useState<string[]>(["readme"]);

  function handleModeChange(mode: SelectionMode) {
    setSelectionMode(mode);
    setSelectedValue("readme");
    setSelectedValues(["readme"]);
  }

  const paths =
    selectionMode === "single"
      ? selectedValue
        ? [getPath(selectedValue)]
        : []
      : selectedValues.map(getPath);

  return (
    <section className="tree-example">
      <header className="tree-example__header">
        <h1>Tree</h1>
        <p>
          A hierarchical tree view authored by recursive composition. Expand
          branches with their row, the chevron, or <kbd>ArrowRight</kbd> /{" "}
          <kbd>ArrowLeft</kbd>. Use <kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd>{" "}
          and <kbd>Home</kbd> / <kbd>End</kbd> to navigate; <kbd>Enter</kbd> or{" "}
          <kbd>Space</kbd> to activate.
        </p>

        <fieldset className="tree-example__modes">
          <legend>Selection mode</legend>
          <label>
            <input
              type="radio"
              name="tree-mode"
              value="single"
              checked={selectionMode === "single"}
              onChange={() => handleModeChange("single")}
            />
            Single
          </label>
          <label>
            <input
              type="radio"
              name="tree-mode"
              value="multiple"
              checked={selectionMode === "multiple"}
              onChange={() => handleModeChange("multiple")}
            />
            Multiple (Ctrl/Cmd + click, Shift + click)
          </label>
        </fieldset>
      </header>

      <div className="tree-example__panel">
        {selectionMode === "single" ? (
          <Tree.Root
            className="tree-example__tree"
            defaultExpandedValues={["src", "components"]}
            defaultSelectedValue="readme"
            onSelectedValueChange={setSelectedValue}
          >
            {renderProject()}
          </Tree.Root>
        ) : (
          <Tree.Root
            className="tree-example__tree"
            selectionMode="multiple"
            defaultExpandedValues={["src", "components"]}
            defaultSelectedValues={["readme"]}
            onSelectedValuesChange={setSelectedValues}
          >
            {renderProject()}
          </Tree.Root>
        )}
        <SelectionBreadcrumbs paths={paths} />
      </div>
    </section>
  );
}

function renderProject() {
  return (
    <>
      <Tree.Item value="readme">
        <div className="tree-example__row">
          <span className="tree-example__chevron-slot" aria-hidden="true" />
          <span className="tree-example__glyph">📄</span>
          readme.md
        </div>
      </Tree.Item>

      <Tree.Branch value="src">
        <Tree.BranchControl className="tree-example__row">
          <Tree.BranchIndicator className="tree-example__chevron">
            ▸
          </Tree.BranchIndicator>
          <span className="tree-example__glyph">📁</span>
          src
        </Tree.BranchControl>
        <Tree.BranchContent forceMount>
          <Tree.Item value="index">
            <div className="tree-example__row">
              <span className="tree-example__chevron-slot" aria-hidden="true" />
              <span className="tree-example__glyph">📄</span>
              index.ts
            </div>
          </Tree.Item>

          <Tree.Branch value="components">
            <Tree.BranchControl className="tree-example__row">
              <Tree.BranchIndicator className="tree-example__chevron">
                ▸
              </Tree.BranchIndicator>
              <span className="tree-example__glyph">📁</span>
              components
            </Tree.BranchControl>
            <Tree.BranchContent forceMount>
              <Tree.Item value="button">
                <div className="tree-example__row">
                  <span
                    className="tree-example__chevron-slot"
                    aria-hidden="true"
                  />
                  <span className="tree-example__glyph">📄</span>
                  button.tsx
                </div>
              </Tree.Item>
              <Tree.Item value="dialog">
                <div className="tree-example__row">
                  <span
                    className="tree-example__chevron-slot"
                    aria-hidden="true"
                  />
                  <span className="tree-example__glyph">📄</span>
                  dialog.tsx
                </div>
              </Tree.Item>
              <Tree.Item value="legacy" disabled>
                <div className="tree-example__row">
                  <span
                    className="tree-example__chevron-slot"
                    aria-hidden="true"
                  />
                  <span className="tree-example__glyph">📄</span>
                  legacy.tsx (disabled)
                </div>
              </Tree.Item>
            </Tree.BranchContent>
          </Tree.Branch>

          <Tree.Item value="utils">
            <div className="tree-example__row">
              <span className="tree-example__chevron-slot" aria-hidden="true" />
              <span className="tree-example__glyph">📄</span>
              utils.ts
            </div>
          </Tree.Item>
        </Tree.BranchContent>
      </Tree.Branch>

      <Tree.Branch value="docs">
        <Tree.BranchControl className="tree-example__row">
          <Tree.BranchIndicator className="tree-example__chevron">
            ▸
          </Tree.BranchIndicator>
          <span className="tree-example__glyph">📁</span>
          docs
        </Tree.BranchControl>
        <Tree.BranchContent forceMount>
          <Tree.Item value="guides">
            <div className="tree-example__row">
              <span className="tree-example__chevron-slot" aria-hidden="true" />
              <span className="tree-example__glyph">📄</span>
              guides.md
            </div>
          </Tree.Item>
        </Tree.BranchContent>
      </Tree.Branch>

      <Tree.Item value="pkg">
        <div className="tree-example__row">
          <span className="tree-example__chevron-slot" aria-hidden="true" />
          <span className="tree-example__glyph">📦</span>
          package.json
        </div>
      </Tree.Item>
    </>
  );
}
