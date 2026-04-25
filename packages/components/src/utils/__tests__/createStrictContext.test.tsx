import { render, screen } from "@testing-library/react";

import { createStrictContext } from "../createStrictContext";

describe("createStrictContext", () => {
  it("returns the provided value when the hook is used inside a Provider", () => {
    // Arrange
    const [Context, useStrictContext] = createStrictContext<{ label: string }>(
      "Component must be used inside a Provider.",
      "TestContext",
    );

    function Consumer() {
      const value = useStrictContext();
      return <span>{value.label}</span>;
    }

    // Act
    render(
      <Context.Provider value={{ label: "hello" }}>
        <Consumer />
      </Context.Provider>,
    );

    // Assert
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("throws the provided error message when the hook is used outside a Provider", () => {
    // Arrange
    const [, useStrictContext] = createStrictContext<{ label: string }>(
      "Custom error: must be inside Provider.",
    );

    function Consumer() {
      useStrictContext();
      return null;
    }

    // Suppress React's error logging for the expected throw.
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Act & Assert
    expect(() => render(<Consumer />)).toThrow(
      "Custom error: must be inside Provider.",
    );

    errorSpy.mockRestore();
  });

  it("sets the supplied displayName on the returned Context", () => {
    // Arrange & Act
    const [Context] = createStrictContext<unknown>(
      "error",
      "MyDisplayName",
    );

    // Assert
    expect(Context.displayName).toBe("MyDisplayName");
  });

  it("leaves displayName unset when no displayName is supplied", () => {
    // Arrange & Act
    const [Context] = createStrictContext<unknown>("error");

    // Assert
    expect(Context.displayName).toBeUndefined();
  });
});
