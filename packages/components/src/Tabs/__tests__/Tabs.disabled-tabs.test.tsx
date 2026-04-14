import { render, screen } from "@testing-library/react";
import { Tabs } from "../Tabs";

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
});
