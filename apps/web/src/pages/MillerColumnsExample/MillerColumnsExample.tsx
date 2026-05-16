import { MillerColumns } from "@primitiv/react";
import { ChevronRight } from "@primitiv/icons";

import "./MillerColumnsExample.scss";

type FileNode = {
  id: string;
  label: string;
  children?: FileNode[];
};

const tree: FileNode[] = [
  {
    id: "documents",
    label: "Documents",
    children: [
      {
        id: "work",
        label: "Work",
        children: [
          { id: "report", label: "report.pdf" },
          { id: "notes", label: "notes.txt" },
          { id: "budget", label: "budget.xlsx" },
        ],
      },
      {
        id: "personal",
        label: "Personal",
        children: [
          { id: "taxes", label: "taxes.pdf" },
          { id: "letter", label: "letter.docx" },
        ],
      },
      { id: "readme", label: "README.md" },
    ],
  },
  {
    id: "pictures",
    label: "Pictures",
    children: [
      {
        id: "holiday",
        label: "Holiday",
        children: [
          { id: "beach", label: "beach.jpg" },
          { id: "sunset", label: "sunset.jpg" },
        ],
      },
      { id: "profile", label: "profile.png" },
    ],
  },
  {
    id: "music",
    label: "Music",
    children: [{ id: "song", label: "song.mp3" }],
  },
];

function Node({ node }: { node: FileNode }) {
  const isDirectory = Boolean(node.children?.length);

  return (
    <MillerColumns.Item value={node.id} className="miller__item">
      <span className="miller__label">{node.label}</span>
      {isDirectory ? (
        <>
          <MillerColumns.ItemIndicator className="miller__chevron">
            <ChevronRight />
          </MillerColumns.ItemIndicator>
          <MillerColumns.Column className="miller__column">
            {node.children?.map((child) => (
              <Node key={child.id} node={child} />
            ))}
          </MillerColumns.Column>
        </>
      ) : null}
    </MillerColumns.Item>
  );
}

export function MillerColumnsExample() {
  return (
    <section className="miller-example">
      <h2>Miller Columns</h2>
      <p>
        Click a folder to reveal its contents in the next column. Use the
        arrow keys to navigate: up/down within a column, right to descend
        into a folder, left to return to its parent.
      </p>
      <MillerColumns.Root defaultValue={["documents"]} className="miller">
        <MillerColumns.Column className="miller__column">
          {tree.map((node) => (
            <Node key={node.id} node={node} />
          ))}
        </MillerColumns.Column>
      </MillerColumns.Root>
    </section>
  );
}
