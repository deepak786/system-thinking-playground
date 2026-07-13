import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

/**
 * Metadata describing a single interactive demo. Routes, the sidebar, and the
 * Home page cards are all generated from `demoRegistry.ts`, so adding a demo
 * is: create its folder, then add one `DemoDefinition` entry.
 */
export type DemoDefinition = {
  /** Stable slug; also the URL path (e.g. "whatsapp-delivery" → /whatsapp-delivery). */
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
}
