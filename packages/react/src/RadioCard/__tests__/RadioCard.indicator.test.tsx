import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RadioCard } from "../RadioCard";

describe("RadioCard indicator", () => {
  it("does not render the indicator when the item is unchecked", () => {
    // Arrange & Act
    render(
      <RadioCard.Root aria-label="Plan">
        <RadioCard.Item value="pro">
          <RadioCard.Indicator data-testid="indicator" />
          Pro
        </RadioCard.Item>
      </RadioCard.Root>,
    );

    // Assert
    expect(screen.queryByTestId("indicator")).not.toBeInTheDocument();
  });

  it("renders the indicator when the item is checked", () => {
    // Arrange & Act
    render(
      <RadioCard.Root aria-label="Plan" defaultValue="pro">
        <RadioCard.Item value="pro">
          <RadioCard.Indicator data-testid="indicator" />
          Pro
        </RadioCard.Item>
      </RadioCard.Root>,
    );

    // Assert
    expect(screen.getByTestId("indicator")).toBeInTheDocument();
  });

  it('sets aria-hidden="true" on the indicator', () => {
    // Arrange & Act
    render(
      <RadioCard.Root aria-label="Plan" defaultValue="pro">
        <RadioCard.Item value="pro">
          <RadioCard.Indicator data-testid="indicator" />
          Pro
        </RadioCard.Item>
      </RadioCard.Root>,
    );

    // Assert
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it('sets data-state="checked" on the indicator when checked', () => {
    // Arrange & Act
    render(
      <RadioCard.Root aria-label="Plan" defaultValue="pro">
        <RadioCard.Item value="pro">
          <RadioCard.Indicator data-testid="indicator" />
          Pro
        </RadioCard.Item>
      </RadioCard.Root>,
    );

    // Assert
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("mounts and unmounts the indicator as the item is selected and deselected", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RadioCard.Root aria-label="Plan" defaultValue="pro">
        <RadioCard.Item value="starter">
          <RadioCard.Indicator data-testid="starter-indicator" />
          Starter
        </RadioCard.Item>
        <RadioCard.Item value="pro">
          <RadioCard.Indicator data-testid="pro-indicator" />
          Pro
        </RadioCard.Item>
      </RadioCard.Root>,
    );

    // Assert initial — only pro indicator visible
    expect(screen.queryByTestId("starter-indicator")).not.toBeInTheDocument();
    expect(screen.getByTestId("pro-indicator")).toBeInTheDocument();

    // Act
    await user.click(screen.getByRole("radio", { name: "Starter" }));

    // Assert after click — starter indicator visible, pro gone
    expect(screen.getByTestId("starter-indicator")).toBeInTheDocument();
    expect(screen.queryByTestId("pro-indicator")).not.toBeInTheDocument();
  });

  it("keeps the indicator in the DOM when forceMount is set", () => {
    // Arrange & Act
    render(
      <RadioCard.Root aria-label="Plan">
        <RadioCard.Item value="pro">
          <RadioCard.Indicator data-testid="indicator" forceMount />
          Pro
        </RadioCard.Item>
      </RadioCard.Root>,
    );

    // Assert — indicator present even though unchecked
    expect(screen.getByTestId("indicator")).toBeInTheDocument();
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "data-state",
      "unchecked",
    );
  });
});
