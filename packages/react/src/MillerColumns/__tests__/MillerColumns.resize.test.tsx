import { fireEvent, render, screen } from "@testing-library/react";

import { MillerColumns } from "../MillerColumns";

describe("MillerColumns — resize handle", () => {
  it("renders a vertical separator inside a column", () => {
    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.ResizeHandle />
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    const handle = screen.getByRole("separator");

    expect(handle).toHaveAttribute("aria-orientation", "vertical");
    expect(handle).toHaveAttribute("data-miller-columns-resize-handle");
  });

  it("throws when ResizeHandle is rendered outside Column", () => {
    expect(() =>
      render(
        <MillerColumns.Root>
          <MillerColumns.ResizeHandle />
        </MillerColumns.Root>,
      ),
    ).toThrow("<MillerColumns.Column>");
  });

  it("resizes its column on pointer drag", () => {
    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.ResizeHandle />
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    const handle = screen.getByRole("separator");
    const column = screen.getByRole("group");

    fireEvent.pointerDown(handle, { clientX: 100 });
    fireEvent.pointerMove(window, { clientX: 260 });
    fireEvent.pointerUp(window);

    expect(column).toHaveStyle({ width: "160px" });
  });

  it("continues a second drag from the already-resized width", () => {
    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.ResizeHandle />
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    const handle = screen.getByRole("separator");
    const column = screen.getByRole("group");

    fireEvent.pointerDown(handle, { clientX: 100 });
    fireEvent.pointerMove(window, { clientX: 260 });
    fireEvent.pointerUp(window);

    fireEvent.pointerDown(handle, { clientX: 0 });
    fireEvent.pointerMove(window, { clientX: 40 });
    fireEvent.pointerUp(window);

    expect(column).toHaveStyle({ width: "200px" });
  });

  it("does not resize a column below zero width", () => {
    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.ResizeHandle />
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    const handle = screen.getByRole("separator");
    const column = screen.getByRole("group");

    fireEvent.pointerDown(handle, { clientX: 100 });
    fireEvent.pointerMove(window, { clientX: -500 });

    expect(column).toHaveStyle({ width: "0px" });
  });

  it("exposes a data-dragging hook while a drag is in progress", () => {
    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.ResizeHandle />
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    const handle = screen.getByRole("separator");

    expect(handle).not.toHaveAttribute("data-dragging");

    fireEvent.pointerDown(handle, { clientX: 0 });
    expect(handle).toHaveAttribute("data-dragging");

    fireEvent.pointerUp(window);
    expect(handle).not.toHaveAttribute("data-dragging");
  });

  it("composes a consumer onPointerDown with the drag", () => {
    const onPointerDown = vi.fn();

    render(
      <MillerColumns.Root>
        <MillerColumns.Column>
          <MillerColumns.ResizeHandle onPointerDown={onPointerDown} />
          <MillerColumns.Item value="a">A</MillerColumns.Item>
        </MillerColumns.Column>
      </MillerColumns.Root>,
    );

    const handle = screen.getByRole("separator");
    const column = screen.getByRole("group");

    fireEvent.pointerDown(handle, { clientX: 100 });
    fireEvent.pointerMove(window, { clientX: 200 });

    expect(onPointerDown).toHaveBeenCalledTimes(1);
    expect(column).toHaveStyle({ width: "100px" });
  });
});
