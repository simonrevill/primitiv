import { render } from "@testing-library/react";

import { CheckboxCard } from "../CheckboxCard";

describe("CheckboxCard error handling", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when CheckboxCard.Indicator is rendered outside a CheckboxCard.Root", () => {
    // Arrange & Act & Assert
    expect(() => render(<CheckboxCard.Indicator />)).toThrow(
      "CheckboxCard sub-components must be rendered inside a <CheckboxCard.Root>.",
    );
  });
});
