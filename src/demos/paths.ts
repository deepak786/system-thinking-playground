import { demoRegistry } from './demoRegistry'
import type { DemoDefinition } from './types'

/** Series URL prefix for a demo, if it belongs to one. */
export function seriesSlugFor(demo: DemoDefinition): string | undefined {
  if (demo.seriesSlug) return demo.seriesSlug
  if (!demo.partOf) return undefined
  return demoRegistry.find((d) => d.id === demo.partOf)?.seriesSlug
}

/**
 * Canonical path for a demo: `/{seriesSlug}/{id}` when part of a series,
 * otherwise `/{id}`. Use this everywhere instead of hardcoding paths.
 */
export function demoPath(demo: DemoDefinition): string {
  const series = seriesSlugFor(demo)
  return series ? `/${series}/${demo.id}` : `/${demo.id}`
}

/** Lookup helper for inter-demo links. Falls back to `/{id}` if unknown. */
export function demoPathById(id: string): string {
  const demo = demoRegistry.find((d) => d.id === id)
  return demo ? demoPath(demo) : `/${id}`
}
