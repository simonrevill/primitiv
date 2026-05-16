import { render } from "@testing-library/react";

import { MillerColumns } from "../MillerColumns";

describe("MillerColumns — error handling", () => {
  it("throws when Column is rendered outside Root", () => {
    expect(() =>
      render(
        <MillerColumns.Column>
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>,
      ),
    ).toThrow("<MillerColumns.Root>");
  });

  it("throws when Item is rendered outside Column", () => {
    expect(() =>
      render(
        <MillerColumns.Root>
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Root>,
      ),
    ).toThrow("<MillerColumns.Column>");
  });

  it("throws when ItemIndicator is rendered outside Item", () => {
    expect(() =>
      render(
        <MillerColumns.Root>
          <MillerColumns.Column>
            <MillerColumns.ItemIndicator>▸</MillerColumns.ItemIndicator>
          </MillerColumns.Column>
        </MillerColumns.Root>,
      ),
    ).toThrow("<MillerColumns.Item>");
  });

  it("throws when an Item declares more than one nested Column", () => {
    expect(() =>
      render(
        <MillerColumns.Root>
          <MillerColumns.Column>
            <MillerColumns.Item value="a">
              A
              <MillerColumns.Column>
                <MillerColumns.Item value="a1">A1</MillerColumns.Item>
              </MillerColumns.Column>
              <MillerColumns.Column>
                <MillerColumns.Item value="a2">A2</MillerColumns.Item>
              </MillerColumns.Column>
            </MillerColumns.Item>
          </MillerColumns.Column>
        </MillerColumns.Root>,
      ),
    ).toThrow("at most one nested");
  });
});
