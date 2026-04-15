import { render, screen, waitFor } from "@testing-library/react";
import { Tabs } from "../Tabs";
import userEvent from "@testing-library/user-event";

describe("Tabs disabled tabs tests", () => {
  it("should have the aria-disabled attribute set to false by default", () => {
    // Arrange
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
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });

    // Assert
    expect(firstTab).toHaveAttribute("aria-disabled", "false");
  });

  it("should not have the native disabled attribute set when disabled prop is provided", () => {
    // Arrange
    render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List label="Test tabs">
          <Tabs.Trigger value="tab1" disabled>
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs.Root>,
    );
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });

    // Assert
    expect(firstTab).not.toHaveAttribute("disabled");
  });

  it("should have the aria-disabled attribute set to true when disabled prop is provided", () => {
    // Arrange
    render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List label="Test tabs">
          <Tabs.Trigger value="tab1" disabled>
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs.Root>,
    );
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });

    // Assert
    expect(firstTab).toHaveAttribute("aria-disabled", "true");
  });

  it("should have the data-disabled attribute set to false by default", () => {
    // Arrange
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
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });

    // Assert
    expect(firstTab).toHaveAttribute("data-disabled", "false");
  });

  it("should have the data-disabled attribute set to true when disabled prop is provided", () => {
    // Arrange
    render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List label="Test tabs">
          <Tabs.Trigger value="tab1" disabled>
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs.Root>,
    );
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });

    // Assert
    expect(firstTab).toHaveAttribute("data-disabled", "true");
  });

  it("should not change the currently active panel when clicking on a disabled tab", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List label="Test tabs">
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2" disabled>
            Tab 2
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs.Root>,
    );
    const currentActivePanel = screen.getByRole("tabpanel", { name: "Tab 1" });
    const disabledTab = screen.getByRole("tab", { name: "Tab 2" });

    // Act
    await user.click(disabledTab);

    // Assert
    expect(currentActivePanel).not.toHaveAttribute("hidden");
  });

  it("should not change the currently active panel when moving to the next focused disabled tab via arrow key", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List label="Test tabs">
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2" disabled>
            Tab 2
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs.Root>,
    );
    const currentActivePanel = screen.getByRole("tabpanel", { name: "Tab 1" });

    // Act
    await user.tab();
    await user.keyboard("{ArrowRight}");

    // Assert
    expect(currentActivePanel).not.toHaveAttribute("hidden");
  });

  it("should not activate a disabled tab when moving backward with ArrowLeft", async () => {
    // Arrange
    render(
      <Tabs.Root defaultValue="tab2">
        <Tabs.List label="Test tabs">
          <Tabs.Trigger value="tab1" disabled>
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs.Root>,
    );
    const currentActivePanel = screen.getByRole("tabpanel", { name: "Tab 2" });

    // Act
    await userEvent.tab();
    await userEvent.keyboard("{ArrowLeft}");

    // Assert
    expect(currentActivePanel).not.toHaveAttribute("hidden");
  });

  it("should not activate a disabled tab when pressing Home", async () => {
    // Arrange
    render(
      <Tabs.Root defaultValue="tab2">
        <Tabs.List label="Test tabs">
          <Tabs.Trigger value="tab1" disabled>
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs.Root>,
    );
    const currentActivePanel = screen.getByRole("tabpanel", { name: "Tab 2" });

    // Act
    await userEvent.tab();
    await userEvent.keyboard("{Home}");

    // Assert
    expect(currentActivePanel).not.toHaveAttribute("hidden");
  });
});
