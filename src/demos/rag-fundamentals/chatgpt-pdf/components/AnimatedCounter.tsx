import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'

type Props = {
  /** Target number; the counter eases toward it whenever it changes. */
  value: number
  /** Seconds the count-up takes. */
  duration?: number
}

/**
 * A number that counts up (or down) to its target instead of snapping.
 * Keeps its current position between target changes, so successive updates
 * read as one continuous tally.
 */
export function AnimatedCounter({ value, duration = 0.8 }: Props) {
  const raw = useMotionValue(0)
  const rounded = useTransform(raw, (v) => Math.round(v).toString())

  useEffect(() => {
    const controls = animate(raw, value, { duration, ease: 'easeOut' })
    return () => controls.stop()
  }, [raw, value, duration])

  return <motion.span className="tabular-nums">{rounded}</motion.span>
}
