import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "../Button";

describe("Button keyboard interaction", () => {
  it("fires onClick when activated with Enter", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    screen.getByRole("button", { name: "Save" }).focus();

    // Act
    await user.keyboard("{Enter}");

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("fires onClick when activated with Space", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    screen.getByRole("button", { name: "Save" }).focus();

    // Act
    await user.keyboard(" ");

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is reachable via Tab", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <>
        <input aria-label="Name" />
        <Button>Save</Button>
      </>,
    );
    screen.getByRole("textbox", { name: "Name" }).focus();

    // Act
    await user.tab();

    // Assert
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
  });

  it("is not reachable via Tab when disabled", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <>
        <input aria-label="Name" />
        <Button disabled>Save</Button>
      </>,
    );
    screen.getByRole("textbox", { name: "Name" }).focus();

    // Act
    await user.tab();

    // Assert
    expect(screen.getByRole("button", { name: "Save" })).not.toHaveFocus();
  });
});
