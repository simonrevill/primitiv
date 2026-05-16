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
            <MillerColumns.Item value="apple">
              Apple
              <MillerColumns.Column>
                <MillerColumns.Item value="gala">Gala</MillerColumns.Item>
              </MillerColumns.Column>
            </MillerColumns.Item>
          </MillerColumns.Column>
        </MillerColumns.Item>
        <MillerColumns.Item value="veg">Veg</MillerColumns.Item>
      </MillerColumns.Column>
    </MillerColumns.Root>
  );
}

describe("MillerColumns — auto-scroll", () => {
  it("scrolls the strip to reveal a newly opened column", async () => {
    const user = userEvent.setup();

    render(<Tree />);

    const strip = screen.getByRole("tree");
    const scrollTo = vi.spyOn(strip, "scrollTo");

    await user.click(screen.getByRole("treeitem", { name: "Fruit" }));

    expect(scrollTo).toHaveBeenCalled();
  });
});
