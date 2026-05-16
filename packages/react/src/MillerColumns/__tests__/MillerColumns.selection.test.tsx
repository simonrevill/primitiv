import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MillerColumns } from "../MillerColumns";
import { useMillerColumnsSelection } from "../useMillerColumnsSelection";

function SelectionProbe() {
  const { path, selectedValue } = useMillerColumnsSelection();

  return (
    <div data-testid="probe" data-selected={selectedValue}>
      {path.join("/")}
    </div>
  );
}

describe("MillerColumns — useMillerColumnsSelection", () => {
  it("exposes the active path and the deepest selected value", async () => {
    const user = userEvent.setup();

    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.Item value="fruit">
            Fruit
            <MillerColumns.Column>
              <MillerColumns.Item value="apple">Apple</MillerColumns.Item>
            </MillerColumns.Column>
          </MillerColumns.Item>
        </MillerColumns.Column>
        <SelectionProbe />
      </MillerColumns.Root>,
    );

    const probe = screen.getByTestId("probe");

    expect(probe).toHaveTextContent("");
    expect(probe).not.toHaveAttribute("data-selected");

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));

    expect(probe).toHaveTextContent("fruit");
    expect(probe).toHaveAttribute("data-selected", "fruit");

    await user.click(screen.getByRole("treeitem", { name: "Apple" }));

    expect(probe).toHaveTextContent("fruit/apple");
    expect(probe).toHaveAttribute("data-selected", "apple");
  });

  it("throws when used outside Root", () => {
    expect(() => render(<SelectionProbe />)).toThrow("<MillerColumns.Root>");
  });
});
