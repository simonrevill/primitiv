import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MillerColumns } from "../MillerColumns";

describe("MillerColumns — disabled items", () => {
  it("does not select a disabled item when it is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.Item value="a" disabled>
            A
          </MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    const item = screen.getByRole("treeitem", { name: "A" });
    await user.click(item);

    expect(item).toHaveAttribute("aria-selected", "false");
  });

  it("exposes aria-disabled and data-disabled on a disabled item only", () => {
    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.Item value="a" disabled>
            A
          </MillerColumns.Item>
          <MillerColumns.Item value="b">B</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    const disabled = screen.getByRole("treeitem", { name: "A" });
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(disabled).toHaveAttribute("data-disabled");

    const enabled = screen.getByRole("treeitem", { name: "B" });
    expect(enabled).not.toHaveAttribute("aria-disabled");
    expect(enabled).not.toHaveAttribute("data-disabled");
  });

  it("does not invoke a consumer onClick on a disabled item", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.Item value="a" disabled onClick={onClick}>
            A
          </MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    await user.click(screen.getByRole("treeitem", { name: "A" }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
