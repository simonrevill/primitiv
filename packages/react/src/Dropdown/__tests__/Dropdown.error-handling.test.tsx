import { render } from "@testing-library/react";

import { Dropdown } from "../Dropdown";

describe("Dropdown error handling", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when Dropdown.Trigger is used outside Dropdown.Root", () => {
    // Arrange & Act & Assert
    expect(() =>
      render(<Dropdown.Trigger>Orphan</Dropdown.Trigger>),
    ).toThrowError(
      "Dropdown sub-components must be rendered inside a <Dropdown.Root>.",
    );
  });

  it("throws when Dropdown.Content is used outside Dropdown.Root", () => {
    // Arrange & Act & Assert
    expect(() =>
      render(
        <Dropdown.Content>
          <Dropdown.Item>Orphan</Dropdown.Item>
        </Dropdown.Content>,
      ),
    ).toThrowError(
      "Dropdown sub-components must be rendered inside a <Dropdown.Root>.",
    );
  });

  it("throws when Dropdown.SubTrigger is used outside Dropdown.Sub", () => {
    // Arrange & Act & Assert
    expect(() =>
      render(
        <Dropdown.Root defaultOpen>
          <Dropdown.Trigger>File</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.SubTrigger>Orphan</Dropdown.SubTrigger>
          </Dropdown.Content>
        </Dropdown.Root>,
      ),
    ).toThrowError(
      "Dropdown.SubTrigger and Dropdown.SubContent must be rendered inside a <Dropdown.Sub>.",
    );
  });

  it("throws when Dropdown.SubContent is used outside Dropdown.Sub", () => {
    // Arrange & Act & Assert
    expect(() =>
      render(
        <Dropdown.Root defaultOpen>
          <Dropdown.Trigger>File</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.SubContent>
              <Dropdown.Item>Orphan</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Content>
        </Dropdown.Root>,
      ),
    ).toThrowError(
      "Dropdown.SubTrigger and Dropdown.SubContent must be rendered inside a <Dropdown.Sub>.",
    );
  });

  it("throws when Dropdown.RadioItem is used outside Dropdown.RadioGroup", () => {
    // Arrange & Act & Assert
    expect(() =>
      render(
        <Dropdown.Root defaultOpen>
          <Dropdown.Trigger>Options</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.RadioItem value="a">A</Dropdown.RadioItem>
          </Dropdown.Content>
        </Dropdown.Root>,
      ),
    ).toThrowError(
      "Dropdown.RadioItem must be rendered inside a <Dropdown.RadioGroup>.",
    );
  });
});
