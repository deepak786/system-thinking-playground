import { motion } from 'framer-motion'
import { Check, FileText } from 'lucide-react'
import { cn } from '../../../lib/cn'
import type { InfoChunk } from '../data'
import { SPRING } from '../animations'

export type ReadState = 'idle' | 'reading' | 'read'

type Props = {
  chunk: InfoChunk
  state: ReadState
  /** Generate stage: this card is the source of the sentence being written. */
  pulsing?: boolean
}

/**
 * One piece of information inside the package. While ChatGPT reads it,
 * a soft sheen sweeps across (like an eye moving down a page); once
 * read it keeps a quiet glow and a "Read" stamp.
 */
export function InfoCard({ chunk, state, pulsing = false }: Props) {
  return (
    <motion.div
      layout
      transition={SPRING}
      className={cn(
        'relative w-full max-w-[440px] overflow-hidden rounded-xl border bg-white px-4 py-2.5 text-left',
        state === 'reading'
          ? 'border-[#0071e3] shadow-[0_4px_16px_rgba(0,113,227,0.24)]'
          : state === 'read'
            ? pulsing
              ? 'border-[#0071e3] bg-[#0071e3]/[0.08] shadow-[0_4px_16px_rgba(0,113,227,0.28)]'
              : 'border-[#0071e3]/40 shadow-[0_2px_12px_rgba(0,113,227,0.14)]'
            : 'border-black/[0.08] shadow-[0_1px_4px_rgba(0,0,0,0.04)]',
        'transition-[border-color,background-color,box-shadow] duration-400',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1d1d1f]">
          <FileText
            className={cn(
              'h-3.5 w-3.5 shrink-0',
              state === 'idle' ? 'text-[#a1a1a6]' : 'text-[#0071e3]',
            )}
            strokeWidth={1.75}
          />
          {chunk.title}
        </span>
        {state === 'read' && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="flex shrink-0 items-center gap-1 rounded-full bg-[#0071e3]/[0.08] px-2 py-0.5 text-[10px] font-semibold text-[#0071e3]"
          >
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
            Read
          </motion.span>
        )}
      </div>
      <p
        className={cn(
          'mt-0.5 text-[12px] leading-snug transition-colors duration-400',
          state === 'idle' ? 'text-[#86868b]' : 'text-[#3d3d3f]',
          pulsing && 'text-[#1d1d1f]',
        )}
      >
        {chunk.snippet}
      </p>

      {/* The reading sheen: a soft band sweeping across the card. */}
      {state === 'reading' && (
        <motion.span
          initial={{ x: '-110%' }}
          animate={{ x: '110%' }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-[#0071e3]/[0.08] to-transparent"
        />
      )}
    </motion.div>
  )
}
