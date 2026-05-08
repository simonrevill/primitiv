import { render } from "@testing-library/react";

import { Collapsible } from "../Collapsible";

describe("Collapsible error handling tests", () => {
  beforeEach(() => {
    // Suppress React's noisy uncaught-error logging while we deliberately
    // render sub-components outside their Root.
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should throw when Collapsible.Trigger is rendered without a Collapsible.Root", () => {
    // Assert
    expect(() =>
      render(<Collapsible.Trigger>Toggle</Collapsible.Trigger>),
    ).toThrow(/Collapsible\.Root/);
  });

  it("should throw when Collapsible.Content is rendered without a Collapsible.Root", () => {
    // Assert
    expect(() =>
      render(<Collapsible.Content>Content</Collapsible.Content>),
    ).toThrow(/Collapsible\.Root/);
  });

  it("should throw when Collapsible.TriggerIcon is rendered without a Collapsible.Root", () => {
    // Assert
    expect(() =>
      render(
        <Collapsible.TriggerIcon>
          <svg />
        </Collapsible.TriggerIcon>,
      ),
    ).toThrow(/Collapsible\.Root/);
  });
});
