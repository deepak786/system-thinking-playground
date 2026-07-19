import { motion } from 'framer-motion'
import { EASE_OUT } from '../animations'
import { metricsForOverlap, type ContextLevel, type StorageLevel } from '../data'
import { cn } from '../../../../lib/cn'

type Props = {
  overlap: number
}

const STORAGE_TONE: Record<StorageLevel, string> = {
  Low: 'text-[#34c759]',
  Medium: 'text-[#0071e3]',
  High: 'text-[#e8594f]',
}

const CONTEXT_TONE: Record<ContextLevel, string> = {
  Weak: 'text-[#e8594f]',
  Fair: 'text-[#86868b]',
  Good: 'text-[#0071e3]',
  Excellent: 'text-[#34c759]',
}

/**
 * Live educational summary for the overlap step — approximate figures
 * that move with the slider so the trade-off is felt, not just stated.
 */
export function OverlapMetrics({ overlap }: Props) {
  const m = metricsForOverlap(overlap)

  return (
    <motion.div
      layout
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className="grid w-full max-w-[520px] grid-cols-2 gap-x-5 gap-y-2.5 rounded-2xl border border-black/[0.08] bg-white px-5 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] sm:grid-cols-3"
    >
      <Metric label="Chunk Size" value={`${m.chunkSize} characters`} />
      <Metric label="Overlap" value={`${m.overlap}%`} accent />
      <Metric label="Estimated Chunks" value={`${m.estimatedChunks}`} />
      <Metric
        label="Storage Required"
        value={m.storage}
        className={STORAGE_TONE[m.storage]}
      />
      <Metric
        label="Context Preservation"
        value={m.context}
        className={CONTEXT_TONE[m.context]}
      />
    </motion.div>
  )
}

function Metric({
  label,
  value,
  accent = false,
  className,
}: {
  label: string
  value: string
  accent?: boolean
  className?: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#86868b]">
        {label}
      </span>
      <AnimateValue
        value={value}
        className={cn(
          'text-[13.5px] font-semibold',
          accent ? 'text-[#0071e3]' : 'text-[#1d1d1f]',
          className,
        )}
      />
    </div>
  )
}

function AnimateValue({ value, className }: { value: string; className?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
      className={className}
    >
      {value}
    </motion.span>
  )
}
