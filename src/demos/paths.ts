import { demoRegistry } from './demoRegistry'
import type { DemoDefinition, PlayableDemo, SeriesDemo } from './types'
import { isPlayable, isSeries } from './types'

/** Canonical path for a series hub: `/{seriesId}`. */
export function seriesPath(series: DemoDefinition | string): string {
  const id = typeof series === 'string' ? series : series.id
  return `/${id}`
}

/** Look up the series that contains this demo, if any. */
export function seriesFor(demo: DemoDefinition): SeriesDemo | undefined {
  return demoRegistry.find(
    (entry): entry is SeriesDemo =>
      isSeries(entry) && entry.demos.some((episode) => episode.id === demo.id),
  )
}

/**
 * Canonical path for a demo: `/{seriesId}/{id}` when nested under a series,
 * otherwise `/{id}`. Use this everywhere instead of hardcoding paths.
 */
export function demoPath(demo: DemoDefinition): string {
  const series = seriesFor(demo)
  return series ? `${seriesPath(series)}/${demo.id}` : `/${demo.id}`
}

/** Find a playable demo by id across top-level demos and series episodes. */
export function findDemo(id: string): PlayableDemo | undefined {
  for (const entry of demoRegistry) {
    if (isPlayable(entry) && entry.id === id) return entry
    if (isSeries(entry)) {
      const match = entry.demos.find(
        (d): d is PlayableDemo => isPlayable(d) && d.id === id,
      )
      if (match) return match
    }
  }
  return undefined
}

/** Lookup helper for inter-demo links. Falls back to `/{id}` if unknown. */
export function demoPathById(id: string): string {
  const demo = findDemo(id)
  return demo ? demoPath(demo) : `/${id}`
}
