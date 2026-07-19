import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

/**
 * A registry entry: either a playable demo or a series hub.
 * - Playable: has `component` (and usually `difficulty` / `concepts`).
 * - Series: has a non-empty `demos` array; lives at `/{id}` and lists those
 *   episodes at `/{id}/{demoId}`. Array order is the Part number.
 */
export type DemoDefinition = {
  /** Stable slug used in the URL. */
  id: string
  title: string
  /** One-line description shown in the sidebar and on cards. */
  description: string
  /**
   * Longer copy for <meta name="description"> and og:description.
   * Falls back to `description` when omitted.
   */
  metaDescription?: string
  /** Social share image (public/ path or absolute URL), used for og:image. */
  ogImage?: string
  icon: LucideIcon
  /** Tailwind text color class for the icon accent. */
  accentClass: string
  /** Difficulty chip — used on playable demo cards. */
  difficulty?: Difficulty
  /** Concept chips — used on playable demo cards. */
  concepts?: string[]
  /** Interactive component — present on playable demos. */
  component?: ComponentType
  /** Nested episodes — when present, this entry is a series hub. */
  demos?: DemoDefinition[]
}

/** A series hub: a DemoDefinition with nested episodes. */
export type SeriesDemo = DemoDefinition & { demos: DemoDefinition[] }

/** A playable leaf demo with a renderable component. */
export type PlayableDemo = DemoDefinition & { component: ComponentType }

export function isSeries(entry: DemoDefinition): entry is SeriesDemo {
  return Array.isArray(entry.demos) && entry.demos.length > 0
}

export function isPlayable(entry: DemoDefinition): entry is PlayableDemo {
  return entry.component != null && !isSeries(entry)
}
