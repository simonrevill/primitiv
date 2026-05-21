import { render, screen } from "@testing-library/react";

import { ContextMenu } from "../ContextMenu";

describe("ContextMenu basic rendering", () => {
  it("renders the Trigger's children so the area that should respond to right-click is in the DOM", () => {
    // Arrange & Act
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div>Right-click area</div>
        </ContextMenu.Trigger>
      </ContextMenu.Root>,
    );

    // Assert
    expect(screen.getByText("Right-click area")).toBeInTheDocument();
  });
});
