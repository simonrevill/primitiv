import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RadioGroup } from "../RadioGroup";

describe("RadioGroup.Indicator", () => {
  it("renders only inside the currently selected item", () => {
    // Arrange & Act
    render(
      <RadioGroup.Root aria-label="Colour" defaultValue="red">
        <RadioGroup.Item value="red">
          Red
          <RadioGroup.Indicator data-testid="red-indicator" />
        </RadioGroup.Item>
        <RadioGroup.Item value="blue">
          Blue
          <RadioGroup.Indicator data-testid="blue-indicator" />
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    // Assert
    expect(screen.getByTestId("red-indicator")).toBeInTheDocument();
    expect(screen.queryByTestId("blue-indicator")).not.toBeInTheDocument();
  });

  it("moves the rendered indicator when the selection changes", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RadioGroup.Root aria-label="Colour" defaultValue="red">
        <RadioGroup.Item value="red">
          Red
          <RadioGroup.Indicator data-testid="red-indicator" />
        </RadioGroup.Item>
        <RadioGroup.Item value="blue">
          Blue
          <RadioGroup.Indicator data-testid="blue-indicator" />
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );
    expect(screen.getByTestId("red-indicator")).toBeInTheDocument();

    // Act
    await user.click(screen.getByRole("radio", { name: "Blue" }));

    // Assert
    expect(screen.queryByTestId("red-indicator")).not.toBeInTheDocument();
    expect(screen.getByTestId("blue-indicator")).toBeInTheDocument();
  });

  it("is decorative: aria-hidden and data-state mirror the item state", () => {
    // Arrange & Act
    render(
      <RadioGroup.Root aria-label="Colour" defaultValue="red">
        <RadioGroup.Item value="red">
          Red
          <RadioGroup.Indicator data-testid="indicator" />
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    // Assert
    const indicator = screen.getByTestId("indicator");
    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(indicator).toHaveAttribute("data-state", "checked");
  });

  it("keeps the indicator mounted when forceMount is set", () => {
    // Arrange & Act
    render(
      <RadioGroup.Root aria-label="Colour" defaultValue="red">
        <RadioGroup.Item value="blue">
          Blue
          <RadioGroup.Indicator forceMount data-testid="blue-indicator" />
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    // Assert
    const indicator = screen.getByTestId("blue-indicator");
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute("data-state", "unchecked");
  });
});
