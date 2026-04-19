import { composeEventHandlers } from "../composeEventHandlers";

describe("composeEventHandlers", () => {
  it("returns a function that calls the consumer's handler first, then ours", () => {
    // Arrange
    const calls: string[] = [];
    const theirs = () => calls.push("theirs");
    const ours = () => calls.push("ours");
    const handler = composeEventHandlers(theirs, ours);

    // Act
    handler({} as Event);

    // Assert
    expect(calls).toEqual(["theirs", "ours"]);
  });

  it("passes the event through to both handlers unchanged", () => {
    // Arrange
    const theirs = vi.fn();
    const ours = vi.fn();
    const handler = composeEventHandlers(theirs, ours);
    const event = { type: "click" } as unknown as Event;

    // Act
    handler(event);

    // Assert
    expect(theirs).toHaveBeenCalledWith(event);
    expect(ours).toHaveBeenCalledWith(event);
  });

  it("still calls our handler when the consumer's handler is undefined", () => {
    // Arrange
    const ours = vi.fn();
    const handler = composeEventHandlers<Event>(undefined, ours);

    // Act
    handler({} as Event);

    // Assert
    expect(ours).toHaveBeenCalledTimes(1);
  });

  it("skips our handler when the consumer called event.preventDefault()", () => {
    // Arrange
    const theirs = (event: Event) => event.preventDefault();
    const ours = vi.fn();
    const handler = composeEventHandlers(theirs, ours);
    const event = new Event("click", { cancelable: true });

    // Act
    handler(event);

    // Assert
    expect(ours).not.toHaveBeenCalled();
  });

  it("still runs our handler after preventDefault when checkForDefaultPrevented is false", () => {
    // Arrange
    const theirs = (event: Event) => event.preventDefault();
    const ours = vi.fn();
    const handler = composeEventHandlers(theirs, ours, {
      checkForDefaultPrevented: false,
    });
    const event = new Event("click", { cancelable: true });

    // Act
    handler(event);

    // Assert
    expect(ours).toHaveBeenCalledTimes(1);
  });
});
