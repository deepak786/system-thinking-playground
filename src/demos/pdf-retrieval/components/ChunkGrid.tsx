import { motion } from 'framer-motion'
import { CHUNKS, TOP_SET } from '../data'
import { EASE_OUT } from '../animations'
import { ChunkCard } from './ChunkCard'

type Props = {
  /** One-shot glow wave across every card (Problem stage). */
  glowing?: boolean
  /** Which card the question is checking right now; -1 when idle. */
  scanIndex?: number
  /** The sweep is finished — every verdict stays visible. */
  scanComplete?: boolean
  /** Slowly sink the irrelevant cards to near-invisible. */
  faded?: boolean
  /**
   * Context stage: only the ranked top 3 count as matches; the other
   * five search candidates are treated as misses and fade with the rest.
   */
  topOnly?: boolean
  /** The three survivors have left for the context box. */
  packed?: boolean
  /** Skip the entrance stagger (when the grid returns for the recap). */
  quickEnter?: boolean
}

/**
 * The wall of twenty chunks. Cards carry stable layoutIds, so survivors
 * can fly out of this grid and into the context box; invisible
 * placeholders keep the wall from reflowing when they leave.
 */
export function ChunkGrid({
  glowing = false,
  scanIndex = -1,
  scanComplete = false,
  faded = false,
  topOnly = false,
  packed = false,
  quickEnter = false,
}: Props) {
  return (
    <motion.ul className="grid w-full max-w-[560px] grid-cols-2 gap-2 sm:grid-cols-4">
      {CHUNKS.map((chunk, i) => {
        const relevance = topOnly
          ? TOP_SET.has(chunk.title)
            ? 'yes'
            : 'no'
          : chunk.relevance
        const leftForContext = packed && TOP_SET.has(chunk.title)
        return (
          <motion.li
            key={chunk.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              ease: EASE_OUT,
              delay: (quickEnter ? 0.015 : 0.05) * i,
            }}
            className="min-w-0"
          >
            {leftForContext ? (
              // Placeholder holds the grid cell so nothing reflows.
              <div aria-hidden className="h-12" />
            ) : (
              <ChunkCard
                title={chunk.title}
                relevance={relevance}
                index={i}
                glowing={glowing}
                active={i === scanIndex}
                verdictShown={scanComplete || (scanIndex >= 0 && i < scanIndex)}
                justChecked={i === scanIndex - 1}
                faded={faded}
              />
            )}
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
