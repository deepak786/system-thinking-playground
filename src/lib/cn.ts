/**
 * Tiny className combiner. Filters out falsy values and joins with a space.
 * Keeps component markup readable without pulling in a dependency.
 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}
