import { motion } from 'framer-motion'
import { Check, Package } from 'lucide-react'
import { SELECTED_CHUNKS } from '../data'
import { SPRING } from '../animations'

/**
 * The parcel, closed. Shares layoutId "package" with the open container
 * and the readable panel, so sealing reads as a physical compression:
 * the open box shrinks into this compact, stamped package — the thing
 * that actually travels to ChatGPT.
 */
export function SealedPackage() {
  return (
    <motion.div
      layoutId="package"
      layout
      transition={SPRING}
      className="relative flex items-center gap-3 rounded-2xl border border-[#0071e3] bg-white px-6 py-3.5 shadow-[0_10px_32px_rgba(0,113,227,0.18)]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0071e3]/[0.08]">
        <Package className="h-5 w-5 text-[#0071e3]" strokeWidth={1.75} />
      </span>
      <span className="flex flex-col">
        <span className="text-[13px] font-semibold text-[#1d1d1f]">
          Context for ChatGPT
        </span>
        <span className="text-[11px] text-[#86868b]">
          1 question &middot; {SELECTED_CHUNKS.length} pieces of information
        </span>
      </span>

      {/* The seal stamp — pops in once the lid closes. */}
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 20, delay: 0.35 }}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0071e3] shadow-[0_2px_10px_rgba(0,113,227,0.45)]"
      >
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      </motion.span>
    </motion.div>
  )
}
