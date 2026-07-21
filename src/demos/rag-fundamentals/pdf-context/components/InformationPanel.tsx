import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { cn } from '../../../../lib/cn'
import { useLiteMotion, useOptionalLayoutId } from '../../../../lib/useLiteMotion'
import { QUESTION, SELECTED_CHUNKS } from '../data'
import { SPRING } from '../animations'

type Props = {
  /** Smaller variant used on the Answer screen as the source reference. */
  compact?: boolean
  /** Index into SELECTED_CHUNKS whose snippet is currently the source. */
  pulseIndex?: number
}

/**
 * The package, opened: everything ChatGPT receives, in plain readable
 * language — a question and three lines of relevant information. No
 * JSON, no code, no technical syntax. Shares layoutId "package" with the
 * ContextContainer so the parcel morphs into this panel.
 */
export function InformationPanel({ compact = false, pulseIndex = -1 }: Props) {
  const lite = useLiteMotion()
  const sharedId = useOptionalLayoutId('package')
  return (
    <motion.div
      layoutId={sharedId}
      layout={!lite}
      transition={SPRING}
      className={cn(
        'flex w-full flex-col rounded-2xl border border-[#0071e3]/30 bg-white text-left shadow-[0_10px_32px_rgba(0,113,227,0.12)]',
        compact ? 'max-w-[440px] gap-2 px-5 py-3.5' : 'max-w-[460px] gap-3 px-6 py-5',
      )}
    >
      <span className="flex items-center justify-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#0071e3]">
        <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
        Information sent to ChatGPT
      </span>

      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#86868b]">
          Question
        </span>
        <p className={cn('font-medium text-[#1d1d1f]', compact ? 'text-[12px]' : 'text-[13px]')}>
          {QUESTION}
        </p>
      </div>

      <div className="h-px w-full bg-black/[0.06]" />

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#86868b]">
          Relevant information
        </span>
        {SELECTED_CHUNKS.map((chunk, i) => (
          <p
            key={chunk.title}
            className={cn(
              'rounded-lg px-2 py-1 leading-snug transition-colors duration-400',
              compact ? 'text-[12px]' : 'text-[13px]',
              i === pulseIndex ? 'bg-[#0071e3]/[0.10] text-[#1d1d1f]' : 'text-[#3d3d3f]',
            )}
          >
            <span
              className={cn(
                'font-semibold',
                i === pulseIndex ? 'text-[#0071e3]' : 'text-[#6e6e73]',
              )}
            >
              {chunk.title}:
            </span>{' '}
            {chunk.snippet}
          </p>
        ))}
      </div>
    </motion.div>
  )
}
