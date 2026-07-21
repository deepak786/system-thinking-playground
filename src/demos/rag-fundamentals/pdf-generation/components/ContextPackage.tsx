import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import { useLiteMotion, useOptionalLayoutId } from '../../../../lib/useLiteMotion'
import { INFO_CHUNKS, QUESTION } from '../data'
import { SPRING } from '../animations'

/**
 * The exact package prepared in the previous episode: the question plus
 * three human-readable lines. This is what arrives at ChatGPT's door.
 */
export function ContextPackage() {
  const lite = useLiteMotion()
  const sharedId = useOptionalLayoutId('gen-package')
  return (
    <motion.div
      layoutId={sharedId}
      layout={!lite}
      transition={SPRING}
      className="flex w-full max-w-[460px] flex-col gap-3 rounded-2xl border border-[#0071e3]/30 bg-white px-6 py-5 text-left shadow-[0_10px_32px_rgba(0,113,227,0.12)]"
    >
      <span className="flex items-center justify-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#0071e3]">
        <Package className="h-3.5 w-3.5" strokeWidth={1.75} />
        Context for ChatGPT
      </span>

      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#86868b]">
          Question
        </span>
        <p className="text-[13px] font-medium text-[#1d1d1f]">{QUESTION}</p>
      </div>

      <div className="h-px w-full bg-black/[0.06]" />

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#86868b]">
          Relevant information
        </span>
        {INFO_CHUNKS.map((chunk) => (
          <p key={chunk.title} className="text-[13px] leading-snug text-[#3d3d3f]">
            <span className="font-semibold text-[#6e6e73]">{chunk.title}:</span>{' '}
            {chunk.snippet}
          </p>
        ))}
      </div>
    </motion.div>
  )
}
