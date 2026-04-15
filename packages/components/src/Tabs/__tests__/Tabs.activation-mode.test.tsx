import { render, screen } from "@testing-library/react";
import { Tabs } from "../Tabs";
import userEvent from "@testing-library/user-event";

describe("Activation mode tests", () => {
  it("should be in automatic mode by default", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List label="Test tabs">
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs.Root>,
    );

    // Act
    await user.tab();
    await user.keyboard("{ArrowRight}");

    // Assert
    const secondTabPanel = screen.getByRole("tabpanel", {
      name: "Tab 2",
    });
    expect(secondTabPanel).not.toHaveAttribute("hidden");
  });
});
