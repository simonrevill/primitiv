import { render, screen } from "@testing-library/react";

import { MillerColumns } from "../MillerColumns";

describe("MillerColumns — basic rendering", () => {
  it("renders the strip with role=tree", () => {
    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    expect(screen.getByRole("tree")).toBeInTheDocument();
  });
});
