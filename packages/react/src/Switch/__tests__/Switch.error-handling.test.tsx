import { render } from "@testing-library/react";

import { Switch } from "../Switch";

describe("Switch error handling", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when Switch.Thumb is rendered outside a Switch.Root", () => {
    // Arrange & Act & Assert
    expect(() => render(<Switch.Thumb />)).toThrow(
      "Switch.Thumb must be rendered inside a <Switch.Root>.",
    );
  });
});
