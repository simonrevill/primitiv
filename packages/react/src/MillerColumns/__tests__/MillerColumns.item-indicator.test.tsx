import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MillerColumns } from "../MillerColumns";

function Tree() {
  return (
    <MillerColumns.Root>
      <MillerColumns.Column>
        <MillerColumns.Item value="fruit">
          Fruit
          <MillerColumns.ItemIndicator data-testid="fruit-indicator">
            ▸
          </MillerColumns.ItemIndicator>
          <MillerColumns.Column>
            <MillerColumns.Item value="apple">Apple</MillerColumns.Item>
          </MillerColumns.Column>
        </MillerColumns.Item>
        <MillerColumns.Item value="veg">
          Veg
          <MillerColumns.ItemIndicator data-testid="veg-indicator">
            ▸
          </MillerColumns.ItemIndicator>
        </MillerColumns.Item>
      </MillerColumns.Column>
    </MillerColumns.Root>
  );
}

describe("MillerColumns — item indicator", () => {
  it("renders the indicator for a branch item, hidden from assistive tech", () => {
    render(<Tree />);

    const indicator = screen.getByTestId("fruit-indicator");
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute("aria-hidden", "true");
  });

  it("renders nothing for a leaf item", () => {
    render(<Tree />);

    expect(screen.queryByTestId("veg-indicator")).not.toBeInTheDocument();
  });

  it("reflects the parent item's selection through data-state", async () => {
    const user = userEvent.setup();

    render(<Tree />);

    const indicator = screen.getByTestId("fruit-indicator");
    expect(indicator).toHaveAttribute("data-state", "unselected");

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));

    expect(indicator).toHaveAttribute("data-state", "selected");
  });
});
