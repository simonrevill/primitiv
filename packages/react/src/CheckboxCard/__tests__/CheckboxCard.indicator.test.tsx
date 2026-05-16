import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CheckboxCard } from "../CheckboxCard";

describe("CheckboxCard indicator", () => {
  it("does not render the indicator when unchecked", () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root aria-label="Enable feature">
        <CheckboxCard.Indicator data-testid="indicator" />
      </CheckboxCard.Root>,
    );

    // Assert
    expect(screen.queryByTestId("indicator")).not.toBeInTheDocument();
  });

  it("renders the indicator when checked", () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root aria-label="Enable feature" defaultChecked>
        <CheckboxCard.Indicator data-testid="indicator" />
      </CheckboxCard.Root>,
    );

    // Assert
    expect(screen.getByTestId("indicator")).toBeInTheDocument();
  });

  it("renders the indicator when indeterminate", () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root
        aria-label="Enable feature"
        checked="indeterminate"
        onCheckedChange={() => {}}
      >
        <CheckboxCard.Indicator data-testid="indicator" />
      </CheckboxCard.Root>,
    );

    // Assert
    expect(screen.getByTestId("indicator")).toBeInTheDocument();
  });

  it('sets aria-hidden="true" on the indicator', () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root aria-label="Enable feature" defaultChecked>
        <CheckboxCard.Indicator data-testid="indicator" />
      </CheckboxCard.Root>,
    );

    // Assert
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it('mirrors data-state="checked" from the root', () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root aria-label="Enable feature" defaultChecked>
        <CheckboxCard.Indicator data-testid="indicator" />
      </CheckboxCard.Root>,
    );

    // Assert
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it('mirrors data-state="indeterminate" from the root', () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root
        aria-label="Enable feature"
        checked="indeterminate"
        onCheckedChange={() => {}}
      >
        <CheckboxCard.Indicator data-testid="indicator" />
      </CheckboxCard.Root>,
    );

    // Assert
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "data-state",
      "indeterminate",
    );
  });

  it("mounts and unmounts the indicator as the card is toggled", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <CheckboxCard.Root aria-label="Enable feature">
        <CheckboxCard.Indicator data-testid="indicator" />
      </CheckboxCard.Root>,
    );

    // Assert initial — not mounted
    expect(screen.queryByTestId("indicator")).not.toBeInTheDocument();

    // Act
    await user.click(screen.getByRole("checkbox", { name: "Enable feature" }));

    // Assert after check — mounted
    expect(screen.getByTestId("indicator")).toBeInTheDocument();

    // Act again
    await user.click(screen.getByRole("checkbox", { name: "Enable feature" }));

    // Assert after uncheck — gone
    expect(screen.queryByTestId("indicator")).not.toBeInTheDocument();
  });

  it("keeps the indicator in the DOM when forceMount is set", () => {
    // Arrange & Act
    render(
      <CheckboxCard.Root aria-label="Enable feature">
        <CheckboxCard.Indicator data-testid="indicator" forceMount />
      </CheckboxCard.Root>,
    );

    // Assert
    expect(screen.getByTestId("indicator")).toBeInTheDocument();
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "data-state",
      "unchecked",
    );
  });
});
