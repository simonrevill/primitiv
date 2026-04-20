import { render } from "@testing-library/react";

import { RadioGroup } from "../RadioGroup";

describe("RadioGroup error handling", () => {
  it("throws a helpful error when RadioGroup.Item is rendered outside Root", () => {
    // Arrange
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    // Assert
    expect(() =>
      render(<RadioGroup.Item value="red">Red</RadioGroup.Item>),
    ).toThrow(/RadioGroup sub-components must be rendered inside/);

    error.mockRestore();
  });

  it("throws a helpful error when RadioGroup.Indicator is rendered outside Item", () => {
    // Arrange
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    // Assert
    expect(() =>
      render(
        <RadioGroup.Root aria-label="Colour">
          <RadioGroup.Indicator />
        </RadioGroup.Root>,
      ),
    ).toThrow(/RadioGroup\.Indicator must be rendered inside/);

    error.mockRestore();
  });
});
