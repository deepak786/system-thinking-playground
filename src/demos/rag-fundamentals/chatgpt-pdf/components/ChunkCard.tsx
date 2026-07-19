import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { EASE_OUT } from '../animations'
import type { DocumentChunk } from '../data'
import { cn } from '../../../../lib/cn'

type Props = {
  chunk: DocumentChunk
  /** Seconds to wait before this chunk appears (or starts its morph). */
  delay: number
  /** Grid placement classes from the parent (orphan-row centering). */
  className?: string
  /**
   * Shared-element id of the mini-chunk tile this card takes over. When
   * provided, the card grows out of that tile instead of fading in.
   */
  layoutId?: string
}

/**
 * One piece of a document, with realistic content. When given a layoutId it
 * morphs out of an existing mini-chunk tile (which itself came from a
 * document slice), completing the document → slice → chunk lineage. The
 * chunk number (#23, #112…) hints that far more than 5 chunks exist.
 */
export function ChunkCard({ chunk, delay, className, layoutId }: Props) {
  const isShared = layoutId !== undefined
  return (
    <motion.li
      layoutId={layoutId}
      initial={isShared ? false : { opacity: 0, y: -28, scale: 0.94 }}
      animate={isShared ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={
        isShared
          ? { layout: { type: 'spring', stiffness: 300, damping: 30, delay } }
          : { delay, duration: 0.55, ease: EASE_OUT }
      }
      className={cn(
        'flex flex-col rounded-xl border border-black/[0.06] bg-white p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
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
        <span className="shrink-0 text-[11px] tabular-nums text-[#a1a1a6]">
          #{chunk.id}
        </span>
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
