import { render, screen } from "@testing-library/react";

import { MillerColumns } from "../MillerColumns";

describe("MillerColumns — resize handle", () => {
  it("renders a vertical separator inside a column", () => {
    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.ResizeHandle />
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    const handle = screen.getByRole("separator");

    expect(handle).toHaveAttribute("aria-orientation", "vertical");
    expect(handle).toHaveAttribute("data-miller-columns-resize-handle");
  });

  it("throws when ResizeHandle is rendered outside Column", () => {
    expect(() =>
      render(
        <MillerColumns.Root>
          <MillerColumns.ResizeHandle />
        </MillerColumns.Root>,
      ),
    ).toThrow("<MillerColumns.Column>");
  });
});
