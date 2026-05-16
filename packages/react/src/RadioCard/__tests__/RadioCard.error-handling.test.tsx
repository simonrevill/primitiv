import { render } from "@testing-library/react";

import { RadioCard } from "../RadioCard";

describe("RadioCard error handling", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when RadioCard.Item is rendered outside a RadioCard.Root", () => {
    // Arrange & Act & Assert
    expect(() =>
      render(<RadioCard.Item value="pro">Pro</RadioCard.Item>),
    ).toThrow(
      "RadioCard sub-components must be rendered inside a <RadioCard.Root>.",
    );
  });

  it("throws when RadioCard.Indicator is rendered outside a RadioCard.Item", () => {
    // Arrange & Act & Assert
    expect(() =>
      render(
        <RadioCard.Root aria-label="Plan">
          <RadioCard.Indicator />
        </RadioCard.Root>,
      ),
    ).toThrow(
      "RadioCard.Indicator must be rendered inside a <RadioCard.Item>.",
    );
  });
});
