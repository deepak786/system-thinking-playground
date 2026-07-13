import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

/**
 * Metadata describing a single interactive demo. Adding a new demo is as simple
 * as implementing a component and registering an entry in `registry.tsx`.
 */
export type DemoDefinition = {
  /** Stable slug used for routing / keys. */
  id: string
  title: string
  /** One-line description shown in the sidebar. */
  description: string
  icon: LucideIcon
  /** Tailwind text color class for the icon accent. */
  accentClass: string
  /** The demo component. Omit while the demo is still "coming soon". */
  component?: ComponentType
  comingSoon?: boolean
}
