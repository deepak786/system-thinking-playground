import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { cn } from '../../../../lib/cn'
import type { DocumentChunk } from '../data'

/**
 * rank1–rank3 express relevance purely visually — strongest emphasis for
 * the best match, progressively weaker for second and third. No numbers,
 * so there's nothing to ask "92% of what?" about.
 */
export type RetrievalMode =
  | 'idle'
  | 'checking'
  | 'rejected'
  /** Fully faded out in place (keeps its grid slot so nothing reflows). */
  | 'gone'
  | 'rank1'
  | 'rank2'
  | 'rank3'

type Props = {
  chunk: DocumentChunk
  mode: RetrievalMode
  /** Entrance stagger (seconds); applies only to the initial mount. */
  delay: number
  /** Seconds before the rank badge pops in (builds ranks up to the best). */
  chipDelay?: number
  /** Shared-element id so the card can fly into the selection stack. */
  layoutId?: string
  className?: string
}

const MODE_TARGETS: Record<
  RetrievalMode,
  { opacity: number; scale: number; y: number; filter: string }
> = {
  idle: { opacity: 1, scale: 1, y: 0, filter: 'grayscale(0)' },
  checking: { opacity: 1, scale: 1.02, y: -3, filter: 'grayscale(0)' },
  rejected: { opacity: 0.45, scale: 0.97, y: 0, filter: 'grayscale(1)' },
  gone: { opacity: 0, scale: 0.95, y: 0, filter: 'grayscale(1)' },
  rank1: { opacity: 1, scale: 1.02, y: 0, filter: 'grayscale(0)' },
  rank2: { opacity: 1, scale: 1, y: 0, filter: 'grayscale(0)' },
  rank3: { opacity: 1, scale: 1, y: 0, filter: 'grayscale(0)' },
}

/** Signal-strength bars: an instantly readable, number-free ranking. */
function StrengthBars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="flex items-end gap-[2px]" aria-hidden>
      {([1, 2, 3] as const).map((bar) => (
        <span
          key={bar}
          className={cn(
            'w-[3px] rounded-full bg-current',
            bar === 1 && 'h-[4px]',
            bar === 2 && 'h-[6px]',
            bar === 3 && 'h-[8px]',
            bar > level && 'opacity-25',
          )}
        />
      ))}
    </span>
  )
}

const RANK_CHIP: Record<
  'rank1' | 'rank2' | 'rank3',
  { label: string; level: 1 | 2 | 3; chipClass: string }
> = {
  rank1: { label: 'Best match', level: 3, chipClass: 'bg-[#0071e3] text-white' },
  rank2: { label: 'Match', level: 2, chipClass: 'bg-[#0071e3]/[0.10] text-[#0071e3]' },
  rank3: { label: 'Match', level: 1, chipClass: 'bg-[#0071e3]/[0.06] text-[#0071e3]/80' },
}

/**
 * A chunk card on the retrieval screen. Same visual anatomy as Screen 2's
 * ChunkCard, plus a verdict lifecycle: a quick lift-and-ring while the
 * question checks it, then either a ranked badge (visual emphasis graded
 * from best downward) or a fade to gray.
 */
export function RetrievalCard({
  chunk,
  mode,
  delay,
  chipDelay = 0,
  layoutId,
  className,
}: Props) {
  const rank = mode === 'rank1' || mode === 'rank2' || mode === 'rank3' ? mode : null

  // The entrance delay must only apply to the initial mount — never when a
  // card returns to idle between checks.
  const entered = useRef(false)
  useEffect(() => {
    entered.current = true
  }, [])

  const transition = !entered.current
    ? { delay, type: 'spring' as const, stiffness: 300, damping: 28 }
    : mode === 'checking' || mode === 'idle'
      ? { duration: 0.13, ease: 'easeOut' as const }
      : { type: 'spring' as const, stiffness: 300, damping: 28 }

  return (
    <motion.li
      layoutId={layoutId}
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={MODE_TARGETS[mode]}
      transition={transition}
      className={cn(
        'flex flex-col rounded-xl border bg-white p-4 text-left transition-[border-color,box-shadow] duration-150',
        mode === 'checking' &&
          'border-[#0071e3]/50 shadow-[0_0_0_3px_rgba(0,113,227,0.12),0_8px_20px_rgba(0,113,227,0.12)]',
        mode === 'rank1' &&
          'border-[#0071e3]/40 shadow-[0_0_0_3px_rgba(0,113,227,0.16),0_10px_24px_rgba(0,113,227,0.14)]',
        mode === 'rank2' && 'border-[#0071e3]/25 shadow-[0_2px_8px_rgba(0,113,227,0.08)]',
        mode === 'rank3' && 'border-[#0071e3]/[0.15] shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        (mode === 'idle' || mode === 'rejected') &&
          'border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        className,
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 rounded-md bg-[#f5f5f4] px-2 py-1 ring-1 ring-inset ring-black/[0.04]">
          <FileText className="h-3 w-3 shrink-0 text-[#86868b]" strokeWidth={1.75} />
          <span className="truncate text-[11px] font-medium text-[#6e6e73]">
            {chunk.source}
          </span>
        </span>

        {/* Right side: chunk number until a rank lands, then the badge.
            Rejected cards keep their number — they were read, not chosen. */}
        <AnimatePresence mode="wait" initial={false}>
          {rank ? (
            <motion.span
              key="rank"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 24,
                delay: chipDelay,
              }}
              className={cn(
                'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium',
                RANK_CHIP[rank].chipClass,
              )}
            >
              <StrengthBars level={RANK_CHIP[rank].level} />
              {RANK_CHIP[rank].label}
            </motion.span>
          ) : (
            <motion.span
              key="id"
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="shrink-0 text-[11px] tabular-nums text-[#a1a1a6]"
            >
              #{chunk.id}
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      <span className="mt-2.5 block text-[14px] font-semibold leading-tight text-[#1d1d1f]">
        {chunk.title}
      </span>
      <span className="mt-1 block text-[13px] leading-snug text-[#6e6e73] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
        {chunk.text}
      </span>
    </motion.li>
  )
}
