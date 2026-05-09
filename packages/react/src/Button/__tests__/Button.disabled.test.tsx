import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "../Button";

describe("Button disabled state", () => {
  it("sets the native disabled attribute", () => {
    // Arrange & Act
    render(<Button disabled>Save</Button>);

    // Assert
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it('sets data-disabled="" as a CSS styling hook', () => {
    // Arrange & Act
    render(<Button disabled>Save</Button>);

    // Assert
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "data-disabled",
      "",
    );
  });

  it("does not set data-disabled when not disabled", () => {
    // Arrange & Act
    render(<Button>Save</Button>);

    // Assert
    expect(screen.getByRole("button", { name: "Save" })).not.toHaveAttribute(
      "data-disabled",
    );
  });

  it("does not fire onClick when disabled", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Save" }));

    // Assert
    expect(onClick).not.toHaveBeenCalled();
  });
});
