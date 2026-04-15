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

  it("should activate the next tab when focusing it in manual mode and pressing the 'Space' key", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
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
    await user.keyboard("{Space}");

    // Assert
    const secondTab = screen.getByRole("tab", {
      name: "Tab 2",
    });
    expect(secondTab).toHaveFocus();
    expect(secondTab).toHaveAttribute("aria-selected", "true");
  });
});
