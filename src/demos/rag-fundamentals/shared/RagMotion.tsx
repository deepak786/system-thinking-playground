import type { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import { useLiteMotion } from '../../../lib/useLiteMotion'

/**
 * Desktop: full cinematic motion (still respects OS reduced-motion).
 * Mobile: keep entrance / stage animations, but use snappier tweens.
 * Shared-element layoutIds are disabled separately via useOptionalLayoutId.
 */
export function RagMotion({ children }: { children: ReactNode }) {
  const lite = useLiteMotion()

  return (
    <MotionConfig
      reducedMotion="user"
      transition={
        lite
          ? { type: 'tween', duration: 0.32, ease: [0.16, 1, 0.3, 1] }
          : undefined
      }
    >
      {children}
    </MotionConfig>
  )
}
