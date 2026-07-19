import { AnimatePresence, motion } from 'framer-motion'
import { EASE_OUT } from '../animations'
import { splitForOverlap } from '../data'

type Props = {
  overlap: number
}

function join(words: string[]) {
  return words.join(' ')
}

/**
 * Two neighboring chunks drawn from the handbook prose. Shared words
 * carry a soft blue highlight that grows/shrinks as the overlap slider
 * moves — zero overlap means nothing in common.
 */
export function OverlapPreview({ overlap }: Props) {
  const { prefix, shared, suffix } = splitForOverlap(overlap)
  const hasShared = shared.length > 0

  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      <ChunkCard
        label="Chunk 1"
        unique={prefix}
        shared={shared}
        sharedSide="end"
        hasShared={hasShared}
      />
      <ChunkCard
        label="Chunk 2"
        unique={suffix}
        shared={shared}
        sharedSide="start"
        hasShared={hasShared}
      />
    </div>
  )
}

type CardProps = {
  label: string
  unique: string[]
  shared: string[]
  sharedSide: 'start' | 'end'
  hasShared: boolean
}

function ChunkCard({ label, unique, shared, sharedSide, hasShared }: CardProps) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className="flex flex-col gap-2 rounded-2xl border border-black/[0.08] bg-white px-4 py-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#86868b]">
        {label}
      </span>
      <p className="text-[13.5px] leading-relaxed text-[#1d1d1f]">
        {sharedSide === 'start' && hasShared && (
          <SharedSpan words={shared} />
        )}
        {sharedSide === 'start' && hasShared && unique.length > 0 && ' '}
        {unique.length > 0 && <span>{join(unique)}</span>}
        {sharedSide === 'end' && hasShared && unique.length > 0 && ' '}
        {sharedSide === 'end' && hasShared && (
          <SharedSpan words={shared} />
        )}
      </p>
      {!hasShared && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] text-[#a1a1a6]"
        >
          No shared text
        </motion.span>
      )}
    </motion.div>
  )
}

function SharedSpan({ words }: { words: string[] }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.mark
        key={join(words)}
        initial={{ backgroundColor: 'rgba(0,113,227,0)', opacity: 0.6 }}
        animate={{ backgroundColor: 'rgba(0,113,227,0.14)', opacity: 1 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="rounded-md px-1 py-0.5 font-medium text-[#0071e3] ring-1 ring-[#0071e3]/25"
      >
        {join(words)}
      </motion.mark>
    </AnimatePresence>
  )
}
