import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Dropdown } from "../Dropdown";

describe("Dropdown.ItemIndicator", () => {
  it("renders a span with data-state='checked' when its CheckboxItem is checked", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem defaultChecked>
            <Dropdown.ItemIndicator data-testid="indicator">
              <svg aria-hidden="true" data-testid="icon" />
            </Dropdown.ItemIndicator>
            Show bookmarks
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const indicator = screen.getByTestId("indicator");
    expect(indicator.tagName).toBe("SPAN");
    expect(indicator).toHaveAttribute("data-state", "checked");
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("does not render when the CheckboxItem is unchecked and forceMount is not set", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem>
            <Dropdown.ItemIndicator data-testid="indicator">
              <svg data-testid="icon" />
            </Dropdown.ItemIndicator>
            Show bookmarks
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    expect(screen.queryByTestId("indicator")).not.toBeInTheDocument();
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
  });

  it("still renders with data-state='unchecked' when unchecked but forceMount is set", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem>
            <Dropdown.ItemIndicator forceMount data-testid="indicator">
              <svg data-testid="icon" />
            </Dropdown.ItemIndicator>
            Show bookmarks
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert — DOM is present so consumers can animate in/out via data-state
    const indicator = screen.getByTestId("indicator");
    expect(indicator).toHaveAttribute("data-state", "unchecked");
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("sets data-state='indeterminate' when the CheckboxItem is indeterminate", () => {
    // Arrange & Act — indeterminate is tri-state; the indicator still renders
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem defaultChecked="indeterminate">
            <Dropdown.ItemIndicator data-testid="indicator">
              <svg data-testid="icon" />
            </Dropdown.ItemIndicator>
            Show bookmarks
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert
    const indicator = screen.getByTestId("indicator");
    expect(indicator).toHaveAttribute("data-state", "indeterminate");
  });

  it("updates its data-state when the CheckboxItem toggles", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem onSelect={(e) => e.preventDefault()}>
            <Dropdown.ItemIndicator
              forceMount
              data-testid="indicator"
            />
            Show bookmarks
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitemcheckbox", { hidden: true });
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "data-state",
      "unchecked",
    );

    // Act
    await user.click(item);

    // Assert
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("renders with data-state='checked' inside a selected RadioItem", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.RadioGroup defaultValue="a">
            <Dropdown.RadioItem value="a">
              <Dropdown.ItemIndicator data-testid="indicator-a" />
              Option A
            </Dropdown.RadioItem>
            <Dropdown.RadioItem value="b">
              <Dropdown.ItemIndicator data-testid="indicator-b" />
              Option B
            </Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert — only the selected radio's indicator is in the DOM
    expect(screen.getByTestId("indicator-a")).toHaveAttribute(
      "data-state",
      "checked",
    );
    expect(screen.queryByTestId("indicator-b")).not.toBeInTheDocument();
  });

  it("updates data-state on RadioItems when the group selection changes", async () => {
    // Arrange
    const user = userEvent.setup();
    function UncontrolledSingleRadio() {
      const [value, setValue] = useState("a");
      return (
        <Dropdown.Root defaultOpen>
          <Dropdown.Trigger>Options</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.RadioGroup value={value} onValueChange={setValue}>
              <Dropdown.RadioItem
                value="a"
                onSelect={(e) => e.preventDefault()}
              >
                <Dropdown.ItemIndicator
                  forceMount
                  data-testid="indicator-a"
                />
                Option A
              </Dropdown.RadioItem>
              <Dropdown.RadioItem
                value="b"
                onSelect={(e) => e.preventDefault()}
              >
                <Dropdown.ItemIndicator
                  forceMount
                  data-testid="indicator-b"
                />
                Option B
              </Dropdown.RadioItem>
            </Dropdown.RadioGroup>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    }
    render(<UncontrolledSingleRadio />);
    const optionB = screen.getByRole("menuitemradio", {
      name: "Option B",
      hidden: true,
    });

    // Act
    await user.click(optionB);

    // Assert
    expect(screen.getByTestId("indicator-a")).toHaveAttribute(
      "data-state",
      "unchecked",
    );
    expect(screen.getByTestId("indicator-b")).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("composes onto a child element via asChild", () => {
    // Arrange & Act
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem defaultChecked>
            <Dropdown.ItemIndicator asChild data-testid="indicator">
              <svg viewBox="0 0 10 10" />
            </Dropdown.ItemIndicator>
            Show bookmarks
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );

    // Assert — the underlying element is the consumer-supplied svg, not a span
    const indicator = screen.getByTestId("indicator");
    expect(indicator.tagName).toBe("svg");
    expect(indicator).toHaveAttribute("data-state", "checked");
  });

  it("throws a descriptive error when rendered outside a CheckboxItem or RadioItem", () => {
    // Arrange — silence React's console.error for the expected throw
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    // Act & Assert
    expect(() =>
      render(
        <Dropdown.Root defaultOpen>
          <Dropdown.Trigger>Options</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.ItemIndicator>
                <svg />
              </Dropdown.ItemIndicator>
              Stray
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>,
      ),
    ).toThrow(
      /Dropdown\.ItemIndicator.*Dropdown\.CheckboxItem.*Dropdown\.RadioItem/,
    );

    consoleError.mockRestore();
  });
});
