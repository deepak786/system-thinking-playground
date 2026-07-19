import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import { TOP_TITLES } from '../data'
import { EASE_OUT } from '../animations'
import { ChunkCard } from './ChunkCard'

/**
 * The destination box on the final screen. The ranked top three fly in
 * from the wall (shared layoutIds) and become one labelled parcel:
 * the context for ChatGPT.
 */
export function ContextContainer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="flex flex-col items-center gap-2.5 rounded-2xl border border-[#0071e3]/30 bg-white px-6 py-4 shadow-[0_10px_32px_rgba(0,113,227,0.12)]"
    >
      <span className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#0071e3]">
        <Package className="h-3.5 w-3.5" strokeWidth={1.75} />
        Context for ChatGPT
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {TOP_TITLES.map((title) => (
          <ChunkCard key={title} title={title} relevance="yes" mini verdictShown />
        ))}
      </div>
    </motion.div>
  )
}
