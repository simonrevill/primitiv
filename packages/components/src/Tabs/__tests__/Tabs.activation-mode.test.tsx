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

  it("should not activate the second tab when focusing its tab in manual mode", async () => {
    // Arrange
    const user = userEvent.setup();
    const { container } = render(
      <Tabs.Root defaultValue="tab1" activationMode="manual">
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
    const secondTabPanel = container.querySelectorAll('[role="tabpanel"]')[1];
    expect(secondTabPanel).not.toBeVisible();
  });

  it.each([
    {
      defaultValue: "tab1",
      direction: "next",
      directionKeys: ["{ArrowRight}"],
      key: " ",
      expectedSelectedTab: "Tab 2",
    },
    {
      defaultValue: "tab2",
      direction: "previous",
      directionKeys: ["{ArrowLeft}"],
      key: " ",
      expectedSelectedTab: "Tab 1",
    },
    {
      defaultValue: "tab1",
      direction: "next",
      directionKeys: ["{ArrowRight}"],
      key: "{Enter}",
      expectedSelectedTab: "Tab 2",
    },
    {
      defaultValue: "tab2",
      direction: "previous",
      directionKeys: ["{ArrowLeft}"],
      key: "{Enter}",
      expectedSelectedTab: "Tab 1",
    },
  ])(
    "should activate the $direction tab when focusing it in manual mode and pressing the $key key",
    async ({ defaultValue, directionKeys, key, expectedSelectedTab }) => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Tabs.Root defaultValue={defaultValue} activationMode="manual">
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
      for (const directionKey of directionKeys) {
        await user.keyboard(directionKey);
      }
      await user.keyboard(key);

      // Assert
      const tab = screen.getByRole("tab", {
        name: expectedSelectedTab,
      });
      expect(tab).toHaveFocus();
      expect(tab).toHaveAttribute("aria-selected", "true");
    },
  );
});
