import { motion } from 'framer-motion'

type Props = {
  /**
   * Shared-element id matching a document slice. When this tile mounts,
   * Framer Motion flies the slice from the page into this grid slot — the
   * chunk is visibly created FROM the document.
   */
  layoutId: string
  /** Seconds this tile waits (holding at the slice) before flying over. */
  delay: number
}

/**
 * An anonymous chunk tile that a document slice transforms into. Deliberately
 * content-free: the point is quantity ("many pieces"), not what's inside
 * each piece. Most fade away during consolidation; five of them are taken
 * over by the example chunk cards.
 */
export function MiniChunk({ layoutId, delay }: Props) {
  return (
    <motion.li
      layoutId={layoutId}
      initial={false}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
      transition={{
        layout: { type: 'spring', stiffness: 320, damping: 30, delay },
      }}
      className="flex h-7 flex-col justify-center gap-[3px] rounded-md border border-black/[0.06] bg-white px-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <div className="h-[2px] w-3/4 rounded-full bg-black/[0.08]" />
      <div className="h-[2px] w-1/2 rounded-full bg-black/[0.06]" />
    </motion.li>
  )
}
