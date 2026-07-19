import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import { SPRING } from '../animations'

/**
 * The parcel. Whatever is placed inside (the question card and the three
 * selected chunks) visually becomes one package. Shares its layoutId with
 * the InformationPanel so the parcel "opens" into readable form.
 */
export function ContextContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      layoutId="package"
      layout
      transition={SPRING}
      className="flex w-full max-w-[420px] flex-col items-center gap-3 rounded-2xl border border-[#0071e3]/30 bg-white px-6 py-4 shadow-[0_10px_32px_rgba(0,113,227,0.12)]"
    >
      <span className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#0071e3]">
        <Package className="h-3.5 w-3.5" strokeWidth={1.75} />
        Context for ChatGPT
      </span>
      {children}
    </motion.div>
  )
}
