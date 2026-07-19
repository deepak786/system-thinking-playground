import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

/**
 * Metadata describing a single interactive demo. Routes, the sidebar, and the
 * Home page cards are all generated from `demoRegistry.ts`, so adding a demo
 * is: create its folder, then add one `DemoDefinition` entry.
 */
export type DemoDefinition = {
  /** Stable slug used in the URL (standalone: /{id}; series: /{seriesSlug}/{id}). */
  id: string
  title: string
  /** One-line description shown in the sidebar and on the Home cards. */
  description: string
  difficulty: Difficulty
  /** Concepts the demo teaches, shown as chips on the Home page. */
  concepts: string[]
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
  component: ComponentType
  /**
   * When set, this demo is an episode of the series anchored by the demo
   * with this id. It is nested under that demo in the sidebar and grouped
   * with it on the Home page. Registry order defines the episode order.
   */
  partOf?: string
  /**
   * URL prefix for a series (e.g. "rag-fundamentals"), set on the series
   * anchor. Anchor + episodes live at `/{seriesSlug}/{id}`; standalone
   * demos stay at `/{id}`.
   */
  seriesSlug?: string
  /** Series name, set on the demo that anchors a series (e.g. episode 1). */
  seriesTitle?: string
  /** One-line series blurb shown in the Home page series header. */
  seriesDescription?: string
}
