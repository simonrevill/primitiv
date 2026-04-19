import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "../Checkbox";

describe("Checkbox.Indicator", () => {
  it("does not render its children when the checkbox is unchecked", () => {
    // Arrange & Act
    render(
      <Checkbox.Root aria-label="Accept terms">
        <Checkbox.Indicator>tick</Checkbox.Indicator>
      </Checkbox.Root>,
    );

    // Assert
    expect(screen.queryByText("tick")).not.toBeInTheDocument();
  });

  it("renders its children when the checkbox is checked", () => {
    // Arrange & Act
    render(
      <Checkbox.Root defaultChecked aria-label="Accept terms">
        <Checkbox.Indicator>tick</Checkbox.Indicator>
      </Checkbox.Root>,
    );

    // Assert
    expect(screen.getByText("tick")).toBeInTheDocument();
  });

  it("renders its children when the checkbox is indeterminate", () => {
    // Arrange & Act
    render(
      <Checkbox.Root defaultChecked="indeterminate" aria-label="Accept terms">
        <Checkbox.Indicator>tick</Checkbox.Indicator>
      </Checkbox.Root>,
    );

    // Assert
    expect(screen.getByText("tick")).toBeInTheDocument();
  });

  it("mounts and unmounts in response to toggling", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Checkbox.Root aria-label="Accept terms">
        <Checkbox.Indicator>tick</Checkbox.Indicator>
      </Checkbox.Root>,
    );
    expect(screen.queryByText("tick")).not.toBeInTheDocument();

    // Act
    await user.click(screen.getByRole("checkbox", { name: "Accept terms" }));

    // Assert
    expect(screen.getByText("tick")).toBeInTheDocument();
  });

  it('carries aria-hidden="true" since it is decorative', () => {
    // Arrange & Act
    render(
      <Checkbox.Root defaultChecked aria-label="Accept terms">
        <Checkbox.Indicator data-testid="indicator">tick</Checkbox.Indicator>
      </Checkbox.Root>,
    );

    // Assert
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("mirrors the checkbox's data-state on the indicator", () => {
    // Arrange & Act
    render(
      <Checkbox.Root defaultChecked="indeterminate" aria-label="Accept terms">
        <Checkbox.Indicator data-testid="indicator">tick</Checkbox.Indicator>
      </Checkbox.Root>,
    );

    // Assert
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "data-state",
      "indeterminate",
    );
  });

  it("stays in the DOM while unchecked when forceMount is set", () => {
    // Arrange & Act
    render(
      <Checkbox.Root aria-label="Accept terms">
        <Checkbox.Indicator forceMount data-testid="indicator">
          tick
        </Checkbox.Indicator>
      </Checkbox.Root>,
    );
    const indicator = screen.getByTestId("indicator");

    // Assert
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute("data-state", "unchecked");
  });

  it("throws when rendered outside Checkbox.Root", () => {
    // Arrange
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    // Assert
    expect(() =>
      render(<Checkbox.Indicator>tick</Checkbox.Indicator>),
    ).toThrow();

    error.mockRestore();
  });
});
