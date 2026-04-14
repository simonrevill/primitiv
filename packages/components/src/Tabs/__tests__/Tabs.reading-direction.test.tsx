import { render, screen } from "@testing-library/react";
import { Tabs } from "../Tabs";
import { TabsReadingDirection } from "../types";

describe("Tabs reading direction tests", () => {
  it('should have the dir attribute set to "ltr" by default', () => {
    // Arrange
    render(<Tabs.Root data-testid="tabs-root" />);
    const tabsRoot = screen.getByTestId("tabs-root");

    // Assert
    expect(tabsRoot).toHaveAttribute("dir", "ltr");
  });

  it.each(["ltr", "rtl"] as TabsReadingDirection[])(
    "should accept dir prop set to %s by default",
    (direction) => {
      // Arrange
      render(<Tabs.Root data-testid="tabs-root" dir={direction} />);
      const tabsRoot = screen.getByTestId("tabs-root");

      // Assert
      expect(tabsRoot).toHaveAttribute("dir", direction);
    },
  );
});
