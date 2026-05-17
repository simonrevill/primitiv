/**
 * Minimal stand-in for Figma's `figma` global, for sandbox unit tests.
 *
 * Only the surface the sandbox actually touches is mocked; assign the
 * result with `vi.stubGlobal('figma', createFigmaMock())`.
 */
export function createFigmaMock() {
  return {
    closePlugin: vi.fn(),
    showUI: vi.fn(),
    currentPage: { name: 'Test Page' },
    ui: {
      postMessage: vi.fn(),
      onmessage: null as ((event: { pluginMessage: unknown }) => void) | null,
    },
  }
}
