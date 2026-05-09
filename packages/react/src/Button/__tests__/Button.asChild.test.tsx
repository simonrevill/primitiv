import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "../Button";

describe("Button asChild composition", () => {
  it("renders the consumer's element instead of <button>", () => {
    // Arrange & Act
    render(
      <Button asChild>
        <a href="/dashboard">Dashboard</a>
      </Button>,
    );

    // Assert
    expect(screen.getByRole("link", { name: "Dashboard" }).tagName).toBe("A");
  });

  it("does not render a <button> when asChild is set", () => {
    // Arrange & Act
    render(
      <Button asChild>
        <a href="/dashboard">Dashboard</a>
      </Button>,
    );

    // Assert
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("merges aria-* props onto the child element", () => {
    // Arrange & Act
    render(
      <Button asChild aria-label="Go to dashboard">
        <a href="/dashboard">Dashboard</a>
      </Button>,
    );

    // Assert
    expect(
      screen.getByRole("link", { name: "Go to dashboard" }),
    ).toHaveAttribute("aria-label", "Go to dashboard");
  });

  it("does not forward type to the child element", () => {
    // Arrange & Act
    render(
      <Button asChild>
        <a href="/dashboard">Dashboard</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Dashboard" });

    // Assert
    expect(link).not.toHaveAttribute("type");
  });

  it("composes onClick — child handler fires first, then Button's", async () => {
    // Arrange
    const user = userEvent.setup();
    const order: string[] = [];
    const childClick = () => order.push("child");
    const buttonClick = () => order.push("button");

    render(
      <Button asChild onClick={buttonClick}>
        <a href="#" onClick={childClick}>
          Dashboard
        </a>
      </Button>,
    );

    // Act
    await user.click(screen.getByRole("link", { name: "Dashboard" }));

    // Assert
    expect(order).toEqual(["child", "button"]);
  });

  it("sets data-disabled on the child element when disabled", () => {
    // Arrange & Act
    render(
      <Button asChild disabled>
        <span>Locked</span>
      </Button>,
    );

    // Assert
    expect(screen.getByText("Locked")).toHaveAttribute("data-disabled", "");
  });
});
