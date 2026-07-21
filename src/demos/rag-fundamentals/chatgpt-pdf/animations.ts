import type { Variants } from 'framer-motion'
import { useLiteMotion } from '../../../lib/useLiteMotion'

/**
 * Entrance choreography shared by all Screen 1 sections: elements fade in and
 * rise ~12px in reading order. Wrapped in <MotionConfig reducedMotion="user">
 * at the top level, so the rise degrades to a plain fade for users who prefer
 * reduced motion.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

/** Slightly tighter stagger on phones so the intro lands sooner. */
export const staggerContainerMobile: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
}

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
}

/** Same entrance polish, shorter travel — used on narrow viewports. */
export const riseInMobile: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: EASE_OUT },
  },
}

/** Cards inside the document grid stagger slightly faster, left to right. */
export const cardGrid: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
}

export const cardGridMobile: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
}

/** Pick entrance variants that stay animated on mobile without feeling heavy. */
export function useEntranceVariants() {
  const lite = useLiteMotion()
  return {
    container: lite ? staggerContainerMobile : staggerContainer,
    rise: lite ? riseInMobile : riseIn,
    cards: lite ? cardGridMobile : cardGrid,
    lite,
  }
}
