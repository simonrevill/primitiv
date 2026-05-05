/**
 * Minimal jsdom polyfill for Element.scrollTo.
 *
 * jsdom does not implement scroll APIs — calling them throws
 * `viewport.scrollTo is not a function`. This polyfill installs a
 * no-op so the React side of programmatic scrolling can run during
 * tests, with `vi.spyOn(viewport, "scrollTo")` still observing the
 * call shape.
 */
export function installScrollPolyfill() {
  if (typeof Element === "undefined") return;
  const proto = Element.prototype as unknown as {
    scrollTo?: () => void;
  };
  if (typeof proto.scrollTo === "function") return;
  proto.scrollTo = function scrollTo() {};
}
