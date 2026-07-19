import type { Variants } from 'framer-motion'

/** The demo's one easing curve — a calm, decelerating ease-out. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const

/** The one spring used for every layout morph. */
export const SPRING = { type: 'spring', stiffness: 300, damping: 30 } as const

/** Parent container that staggers its children in reading order. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

/** Standard entrance: fade in while rising a few pixels. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
}
