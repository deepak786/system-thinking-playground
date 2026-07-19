import type { Variants } from 'framer-motion'

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

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
}

/** Cards inside the document grid stagger slightly faster, left to right. */
export const cardGrid: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
}
