/**
 * Produces the next active path when an item at `depth` with id `value`
 * is selected: keeps the columns shallower than `depth` untouched,
 * appends `value`, and drops everything deeper (those columns close).
 */
export function selectAtDepth(
  path: string[],
  depth: number,
  value: string,
): string[] {
  return [...path.slice(0, depth), value];
}
