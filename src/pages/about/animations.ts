import type { Variants } from 'framer-motion'

export const EASE_OUT = [0.16, 1, 0.3, 1] as const

/** Parent container that staggers its `fadeUp` children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

/** Gentle rise + fade used for almost everything on the page. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
}

/** Scroll-trigger settings shared by every section. */
export const VIEWPORT = { once: true, margin: '-60px' } as const
